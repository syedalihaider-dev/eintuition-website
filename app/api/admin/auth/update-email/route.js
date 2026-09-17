import { z } from "zod";
import prisma from "@/lib/prisma";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
});

export async function PATCH(request) {
  const adminAuth = await requireAdmin(request);
  if (!adminAuth) return jsonError("Unauthorized", 401);

  const body = await parseJson(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 400, parsed.error.flatten());
  }

  const email = parsed.data.email.toLowerCase();
  const conflict = await prisma.admin.findFirst({
    where: {
      email,
      NOT: { id: adminAuth.id },
    },
  });
  if (conflict) return jsonError("Email already in use", 409);

  const updated = await prisma.admin.update({
    where: { id: adminAuth.id },
    data: { email },
    select: { id: true, email: true },
  });

  return jsonOk({ admin: updated });
}
