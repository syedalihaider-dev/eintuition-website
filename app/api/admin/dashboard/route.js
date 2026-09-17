import prisma from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const [earningsAgg, paymentsCount, newQueries, newQuotes, totalQueries, totalQuotes] =
    await Promise.all([
      prisma.payment.aggregate({
        where: { status: "SUCCEEDED" },
        _sum: { amountCents: true },
        _count: true,
      }),
      prisma.payment.count(),
      prisma.contactQuery.count({ where: { status: "NEW" } }),
      prisma.quoteRequest.count({ where: { status: "NEW" } }),
      prisma.contactQuery.count(),
      prisma.quoteRequest.count(),
    ]);

  const totalCents = earningsAgg._sum.amountCents || 0;

  return jsonOk({
    earnings: {
      total: totalCents / 100,
      totalFormatted: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(totalCents / 100),
      totalCents,
      successfulPayments: earningsAgg._count,
      currency: "usd",
    },
    payments: {
      total: paymentsCount,
    },
    queries: {
      new: newQueries,
      total: totalQueries,
    },
    quotes: {
      new: newQuotes,
      total: totalQuotes,
    },
  });
}
