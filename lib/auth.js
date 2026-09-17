import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "eintuition_admin_token";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(admin) {
  return new SignJWT({
    sub: admin.id,
    email: admin.email,
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "admin" || !payload.sub) return null;
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return request.cookies.get(COOKIE_NAME)?.value || null;
}

export async function requireAdmin(request) {
  const token = getTokenFromRequest(request);
  return verifyAdminToken(token);
}

export function adminCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export { COOKIE_NAME };

export async function getAdminFromCookies() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}
