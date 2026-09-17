import { jsonError, jsonOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);
  return jsonOk({ admin });
}
