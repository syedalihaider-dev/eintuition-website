import prisma from "@/lib/prisma";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { quoteSchema } from "@/lib/validators";

export async function POST(request) {
  const body = await parseJson(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 400, parsed.error.flatten());
  }

  const created = await prisma.quoteRequest.create({
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      website: parsed.data.website,
      services: parsed.data.services,
      message: parsed.data.message,
    },
  });

  return jsonOk(created, 201);
}
