import prisma from "@/lib/prisma";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import {
  createAuthCaptureTransaction,
  isAuthorizeConfigured,
  toInvoiceNumber,
} from "@/lib/authorize";
import { checkoutSchema } from "@/lib/validators";

export async function POST(request) {
  const body = await parseJson(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 400, parsed.error.flatten());
  }

  if (!isAuthorizeConfigured()) {
    return jsonError("Authorize.net is not configured", 503);
  }

  const { packageId, customerEmail, customerName, opaqueData } = parsed.data;

  const pkg = await prisma.package.findFirst({
    where: { id: packageId, isActive: true },
  });
  if (!pkg) return jsonError("Package not found or inactive", 404);

  const periodLabel = pkg.billingPeriod === "MONTHLY" ? "Monthly" : "Yearly";

  const payment = await prisma.payment.create({
    data: {
      packageId: pkg.id,
      billingPeriod: pkg.billingPeriod,
      amountCents: pkg.priceCents,
      currency: pkg.currency,
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
      amountCents: pkg.priceCents,
      invoiceNumber,
      description: `${pkg.name} (${periodLabel})`,
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
      include: {
        package: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            features: true,
            billingPeriod: true,
            priceCents: true,
            currency: true,
            isFeatured: true,
          },
        },
      },
    });

    return jsonOk({
      paymentId: succeeded.id,
      paid: true,
      billingPeriod: pkg.billingPeriod,
      package: succeeded.package,
    });
  } catch (error) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    return jsonError(error.message || "Unable to process Authorize.net payment", 500);
  }
}
