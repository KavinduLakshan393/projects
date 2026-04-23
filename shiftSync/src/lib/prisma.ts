import { PrismaClient } from "@prisma/client";

// ──────────────────────────────────────────────────────────────────────────────
// Prisma Singleton Pattern
//
// In Next.js development, hot-module reloading causes the module cache to reset
// on every code change. Without this singleton, each reload would instantiate a
// new PrismaClient, quickly exhausting the PostgreSQL connection pool.
//
// Solution: attach the instance to the `globalThis` object (which persists
// across hot reloads) so only one client is ever active per process.
// ──────────────────────────────────────────────────────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
