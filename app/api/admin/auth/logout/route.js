import { jsonOk } from "@/lib/api";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = jsonOk({ message: "Logged out" });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
