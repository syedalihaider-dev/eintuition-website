import prisma from "@/lib/prisma";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { packageUpdateSchema, slugify } from "@/lib/validators";

export async function GET(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const pkg = await prisma.package.findUnique({ where: { id: params.id } });
  if (!pkg) return jsonError("Package not found", 404);
  return jsonOk(pkg);
}

export async function PATCH(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const existing = await prisma.package.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Package not found", 404);

  const body = await parseJson(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const parsed = packageUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 400, parsed.error.flatten());
  }

  const data = parsed.data;
  let slug = data.slug;
  if (!slug && (data.name || data.billingPeriod)) {
    const name = data.name || existing.name;
    const period = data.billingPeriod || existing.billingPeriod;
    const periodSuffix = period === "MONTHLY" ? "monthly" : "yearly";
    slug = `${slugify(name)}-${periodSuffix}`;
  }

  if (slug && slug !== existing.slug) {
    const conflict = await prisma.package.findUnique({ where: { slug } });
    if (conflict) return jsonError("A package with this slug already exists", 409);
  }

  const updated = await prisma.package.update({
    where: { id: params.id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(slug !== undefined && { slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.features !== undefined && { features: data.features }),
      ...(data.billingPeriod !== undefined && { billingPeriod: data.billingPeriod }),
      ...(data.priceCents !== undefined && { priceCents: data.priceCents }),
      ...(data.currency !== undefined && { currency: data.currency }),
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  return jsonOk(updated);
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const existing = await prisma.package.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Package not found", 404);

  const updated = await prisma.package.update({
    where: { id: params.id },
    data: { isActive: false },
  });

  return jsonOk(updated);
}
