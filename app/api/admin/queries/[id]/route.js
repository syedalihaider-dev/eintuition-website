import prisma from "@/lib/prisma";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { inquiryStatusSchema } from "@/lib/validators";

export async function GET(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const query = await prisma.contactQuery.findUnique({ where: { id: params.id } });
  if (!query) return jsonError("Query not found", 404);
  return jsonOk(query);
}

export async function PATCH(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const existing = await prisma.contactQuery.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Query not found", 404);

  const body = await parseJson(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const parsed = inquiryStatusSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 400, parsed.error.flatten());
  }

  const updated = await prisma.contactQuery.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });

  return jsonOk(updated);
}
