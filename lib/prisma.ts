import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

// Since Prisma 7, PrismaClient requires an explicit driver adapter (no more
// implicit query-engine binary). Dev uses SQLite; swap this file's adapter
// for @prisma/adapter-pg (and DATABASE_URL for a real Postgres URL) in
// production — nothing else in the app needs to change.
const rawUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const dbFile = rawUrl.replace(/^file:/, "");
const url = `file:${path.resolve(dbFile)}`;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
