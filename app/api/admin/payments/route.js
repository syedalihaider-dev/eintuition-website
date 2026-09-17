import prisma from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = await requireAdmin(request);
  if (!admin) return jsonError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const take = Math.min(Number(searchParams.get("limit") || 50), 100);
  const skip = Math.max(Number(searchParams.get("offset") || 0), 0);

  const where = status ? { status } : {};

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        package: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    }),
    prisma.payment.count({ where }),
  ]);

  return jsonOk({ payments, total, take, skip });
}
