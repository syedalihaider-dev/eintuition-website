import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Reuse one client per serverless isolate (Vercel). Without this, concurrent
// cold starts open too many Postgres connections → intermittent 500s.
const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;

export default prisma;
