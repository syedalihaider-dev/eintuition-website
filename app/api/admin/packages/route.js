import prisma from "@/lib/prisma";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { packageSchema, slugify } from "@/lib/validators";

export async function GET(request) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const billingPeriod = searchParams.get("billingPeriod");
  const where =
    billingPeriod === "MONTHLY" || billingPeriod === "YEARLY"
      ? { billingPeriod }
      : {};

  const packages = await prisma.package.findMany({
    where,
    orderBy: [{ billingPeriod: "asc" }, { isFeatured: "desc" }, { priceCents: "asc" }],
  });
  return jsonOk(packages);
}

export async function POST(request) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const body = await parseJson(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const parsed = packageSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 400, parsed.error.flatten());
  }

  const data = parsed.data;
  const periodSuffix = data.billingPeriod === "MONTHLY" ? "monthly" : "yearly";
  const slug = data.slug || `${slugify(data.name)}-${periodSuffix}`;

  const existing = await prisma.package.findUnique({ where: { slug } });
  if (existing) return jsonError("A package with this slug already exists", 409);

  const created = await prisma.package.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      features: data.features,
      billingPeriod: data.billingPeriod,
      priceCents: data.priceCents,
      currency: data.currency || "usd",
      isFeatured: data.isFeatured ?? false,
      isActive: data.isActive ?? true,
    },
  });

  return jsonOk(created, 201);
}
