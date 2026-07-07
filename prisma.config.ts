// Prisma 7 moved connection config out of schema.prisma and into this file.
// This only configures the Prisma CLI (migrate/generate) — the actual
// runtime client's driver adapter is configured separately in lib/prisma.ts.
// Dev uses a SQLite file. To move to Postgres in production, point `url` at
// process.env.DATABASE_URL and change the `provider` line in schema.prisma.
import path from "node:path";
import { defineConfig } from "prisma/config";

const rawUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const dbFile = rawUrl.replace(/^file:/, "");
const absoluteUrl = `file:${path.resolve(dbFile)}`;

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: absoluteUrl,
  },
});
