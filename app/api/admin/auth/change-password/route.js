import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function POST(request) {
  const adminAuth = await requireAdmin(request);
  if (!adminAuth) return jsonError("Unauthorized", 401);

  const body = await parseJson(request);
  if (!body) return jsonError("Invalid JSON body", 400);

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 400, parsed.error.flatten());
  }

  const admin = await prisma.admin.findUnique({ where: { id: adminAuth.id } });
  if (!admin) return jsonError("Unauthorized", 401);

  const valid = await bcrypt.compare(parsed.data.currentPassword, admin.passwordHash);
  if (!valid) return jsonError("Current password is incorrect", 400);

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash },
  });

  return jsonOk({ message: "Password updated" });
}
