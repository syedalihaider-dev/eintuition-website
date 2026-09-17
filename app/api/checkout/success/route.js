import prisma from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api";
import {
  findUnsettledTransactionByInvoice,
  isAuthorizeConfigured,
  toInvoiceNumber,
} from "@/lib/authorize";

const packageSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  features: true,
  billingPeriod: true,
  priceCents: true,
  currency: true,
};

async function loadPayment(paymentId) {
  return prisma.payment.findUnique({
    where: { id: paymentId },
    include: { package: { select: packageSelect } },
  });
}

export async function GET(request) {
  const paymentId = new URL(request.url).searchParams.get("payment_id");
  if (!paymentId) return jsonError("payment_id is required", 400);

  if (!isAuthorizeConfigured()) {
    return jsonError("Authorize.net is not configured", 503);
  }

  try {
    let payment = await loadPayment(paymentId);
    if (!payment) return jsonError("Payment not found", 404);

    if (payment.status === "PENDING") {
      const invoiceNumber =
        payment.authorizeInvoiceNumber || toInvoiceNumber(payment.id);
      const tx = await findUnsettledTransactionByInvoice(invoiceNumber);

      if (tx?.transId) {
        payment = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "SUCCEEDED",
            authorizeTransId: String(tx.transId),
            authorizeInvoiceNumber: invoiceNumber,
            customerEmail: payment.customerEmail,
          },
          include: { package: { select: packageSelect } },
        });
      }
    }

    const paid = payment.status === "SUCCEEDED";

    return jsonOk({
      paid,
      paymentStatus: payment.status,
      customerEmail: payment.customerEmail,
      amountTotal: payment.amountCents,
      currency: payment.currency,
      payment,
    });
  } catch (error) {
    return jsonError(error.message || "Unable to verify payment", 500);
  }
}
