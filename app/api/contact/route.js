import prisma from "@/lib/prisma";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { contactSchema } from "@/lib/validators";

export async function POST(request) {
  const body = await parseJson(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 400, parsed.error.flatten());
  }

  const created = await prisma.contactQuery.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    },
  });

  return jsonOk(created, 201);
}
