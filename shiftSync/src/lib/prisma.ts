// ──────────────────────────────────────────────────────────────────────────────
// Prisma Singleton Pattern
//
// In Next.js development, hot-module reloading causes the module cache to reset
// on every code change. Without this singleton, each reload would instantiate a
// new PrismaClient, quickly exhausting the PostgreSQL connection pool.
//
// Solution: attach the instance to the `globalThis` object (which persists
// across hot reloads) so only one client is ever active per process.
//
// NOTE: We use `ReturnType<typeof createPrismaClient>` for the global type
// annotation instead of importing `PrismaClient` directly. In Prisma v7, the
// generated client class is in .prisma/client but re-exported from @prisma/client.
// Using the factory return type avoids any module resolution timing issues.
// ──────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const createPrismaClient = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
