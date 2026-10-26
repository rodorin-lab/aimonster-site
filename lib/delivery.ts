import { open, realpath } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

// Explicitly reviewed deliverables only. Preview images are never products.
// Add an entry only after checking every advertised file and license in the ZIP.
export const releases: Record<string, { file: string; sha256: string }> = {};

export function commerceConfigured(env = process.env) {
  return env.PACK_SALES_ENABLED === "true" && Boolean(
    env.DATABASE_URL?.startsWith("file:") && env.RESEND_API_KEY &&
    env.RESEND_FROM_EMAIL && env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") &&
    env.STRIPE_WEBHOOK_SECRET && env.STRIPE_SECRET_KEY
  ) && !env.VERCEL; // Current SQLite adapter needs a persistent writable disk.
}

export async function readRelease(slug: string, expectedHash?: string | null) {
  const release = releases[slug];
  if (expectedHash && release?.sha256 !== expectedHash) throw new Error("Purchased release changed");
  if (!release || !/^[a-z0-9-]+\.zip$/.test(release.file)) throw new Error("Product delivery unavailable");
  const root = await realpath(process.env.ASSET_PACK_DIR || "private/packs");
  const file = await realpath(path.join(root, release.file));
  if (!file.startsWith(root + path.sep)) throw new Error("Invalid release path");
  const handle = await open(file, "r");
  try {
    const bytes = await handle.readFile();
    if (bytes.readUInt32LE(0) !== 0x04034b50 || createHash("sha256").update(bytes).digest("hex") !== release.sha256) {
      throw new Error("Release integrity check failed");
    }
    return { bytes, filename: release.file, sha256: release.sha256 };
  } finally { await handle.close(); }
}
