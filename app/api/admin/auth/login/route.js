import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { jsonError, jsonOk, parseJson } from "@/lib/api";
import { adminCookieOptions, signAdminToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(request) {
  try {
    const body = await parseJson(request);
    if (!body) return jsonError("Invalid JSON body", 400);

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Validation failed", 400, parsed.error.flatten());
    }

    const { email, password } = parsed.data;
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return jsonError("Invalid email or password", 401);

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return jsonError("Invalid email or password", 401);

    const token = await signAdminToken(admin);
    const cookie = adminCookieOptions();

    const response = jsonOk({
      token,
      admin: { id: admin.id, email: admin.email },
    });
    response.cookies.set(cookie.name, token, cookie);
    return response;
  } catch (error) {
    console.error("[admin/login]", error);
    return jsonError(error.message || "Login failed", 500);
  }
}
