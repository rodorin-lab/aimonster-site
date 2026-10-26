import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readRelease } from "@/lib/delivery";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{48}$/.test(token)) return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  const purchase = await prisma.purchase.findFirst({ where: { downloadToken: token, status: "succeeded" } });
  if (!purchase) {
    return NextResponse.json({ error: "Invalid or unknown download token." }, { status: 404 });
  }
  if (purchase.downloadExpiresAt && purchase.downloadExpiresAt < new Date()) {
    return NextResponse.json({ error: "This download link has expired." }, { status: 410 });
  }
  try {
    const { bytes, filename } = await readRelease(purchase.packSlug, purchase.deliverySha256);
    return new Response(new Uint8Array(bytes), { headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    } });
  } catch {
    return NextResponse.json({ error: "Delivery is temporarily unavailable. Please contact support with your Stripe receipt." }, { status: 503 });
  }
}
