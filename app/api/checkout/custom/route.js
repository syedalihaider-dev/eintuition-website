import prisma from "@/lib/prisma";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import {
  createAuthCaptureTransaction,
  isAuthorizeConfigured,
  toInvoiceNumber,
} from "@/lib/authorize";
import { customCheckoutSchema } from "@/lib/validators";

export async function POST(request) {
  const body = await parseJson(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const parsed = customCheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 400, parsed.error.flatten());
  }

  if (!isAuthorizeConfigured()) {
    return jsonError("Authorize.net is not configured", 503);
  }

  const { amount, currency, note, customerEmail, customerName, opaqueData } =
    parsed.data;

  const amountCents = Math.round(Number(amount) * 100);
  if (amountCents < 50) {
    return jsonError("Minimum payment amount is $0.50", 400);
  }

  const payment = await prisma.payment.create({
    data: {
      packageId: null,
      billingPeriod: null,
      amountCents,
      currency: (currency || "usd").toLowerCase(),
      note: note?.trim() || "Custom payment",
      status: "PENDING",
      customerEmail: customerEmail || null,
      customerName: customerName || null,
    },
  });

  const invoiceNumber = toInvoiceNumber(payment.id);

  try {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { authorizeInvoiceNumber: invoiceNumber },
    });

    const charge = await createAuthCaptureTransaction({
      amountCents,
      invoiceNumber,
      description: note?.trim() || "Custom payment",
      customerEmail,
      customerName,
      opaqueData,
    });

    const succeeded = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCEEDED",
        authorizeTransId: charge.transId,
        authorizeInvoiceNumber: invoiceNumber,
      },
    });

    return jsonOk({
      paymentId: succeeded.id,
      paid: true,
      amountCents: succeeded.amountCents,
      currency: succeeded.currency,
      note: succeeded.note,
    });
  } catch (error) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    return jsonError(error.message || "Unable to process Authorize.net payment", 500);
  }
}
