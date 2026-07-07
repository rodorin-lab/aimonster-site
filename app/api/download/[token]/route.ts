import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findPack } from "@/lib/packs";

// Honest delivery: there is no packaged-zip pipeline built yet, so instead
// of faking one, this resolves the token to the actual pack and redirects
// to its real static asset (the same image already shown on the pack page).
// Once a real asset-bundling pipeline exists, swap the redirect target for
// a generated zip without changing this route's URL or token contract.
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const purchase = await prisma.purchase.findFirst({ where: { downloadToken: token, status: "succeeded" } });
  if (!purchase) {
    return NextResponse.json({ error: "Invalid or unknown download token." }, { status: 404 });
  }
  if (purchase.downloadExpiresAt && purchase.downloadExpiresAt < new Date()) {
    return NextResponse.json({ error: "This download link has expired." }, { status: 410 });
  }
  const pack = findPack(purchase.packSlug);
  if (!pack) {
    return NextResponse.json({ error: "Pack no longer exists." }, { status: 404 });
  }
  return NextResponse.redirect(new URL(pack.image, _req.url));
}
