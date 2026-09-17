import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      success: true,
      data: {
        status: "ok",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: {
          status: "degraded",
          database: "disconnected",
          error: error.message,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 503 }
    );
  }
}
