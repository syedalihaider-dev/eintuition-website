import prisma from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET(request) {
  const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase();
  if (!email) return jsonError("email is required", 400);

  const payment = await prisma.payment.findFirst({
    where: {
      status: "SUCCEEDED",
      customerEmail: {
        equals: email,
        mode: "insensitive",
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      package: {
        select: {
          id: true,
          name: true,
          slug: true,
          billingPeriod: true,
          priceCents: true,
          currency: true,
          isActive: true,
        },
      },
    },
  });

  if (!payment) {
    return jsonOk({ subscription: null });
  }

  return jsonOk({
    subscription: {
      paymentId: payment.id,
      packageId: payment.packageId,
      packageName: payment.package?.name || null,
      billingPeriod: payment.billingPeriod,
      email: payment.customerEmail,
      amountCents: payment.amountCents,
      currency: payment.currency,
      status: payment.status,
      package: payment.package,
    },
  });
}
