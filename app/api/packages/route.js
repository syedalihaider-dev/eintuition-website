import prisma from "@/lib/prisma";
import { jsonOk } from "@/lib/api";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const billingPeriod = searchParams.get("billingPeriod");

  const where = { isActive: true };
  if (billingPeriod === "MONTHLY" || billingPeriod === "YEARLY") {
    where.billingPeriod = billingPeriod;
  }

  const packages = await prisma.package.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { priceCents: "asc" }],
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
  });

  return jsonOk(packages);
}
