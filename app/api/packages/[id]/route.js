import prisma from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET(_request, { params }) {
  const pkg = await prisma.package.findFirst({
    where: {
      isActive: true,
      OR: [{ id: params.id }, { slug: params.id }],
    },
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

  if (!pkg) return jsonError("Package not found", 404);
  return jsonOk(pkg);
}
