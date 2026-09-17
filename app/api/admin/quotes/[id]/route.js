import prisma from "@/lib/prisma";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { inquiryStatusSchema } from "@/lib/validators";

export async function GET(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const quote = await prisma.quoteRequest.findUnique({ where: { id: params.id } });
  if (!quote) return jsonError("Quote not found", 404);
  return jsonOk(quote);
}

export async function PATCH(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const existing = await prisma.quoteRequest.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError("Quote not found", 404);

  const body = await parseJson(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const parsed = inquiryStatusSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 400, parsed.error.flatten());
  }

  const updated = await prisma.quoteRequest.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });

  return jsonOk(updated);
}
