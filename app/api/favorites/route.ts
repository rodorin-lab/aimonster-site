import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRankBenefits, type Rank } from "@/lib/rank";
import { findCreature } from "@/lib/creatures";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const favorites = await prisma.favorite.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ favorites: favorites.map((f) => f.creatureSlug) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { creatureSlug } = (await req.json().catch(() => ({}))) as { creatureSlug?: string };
  if (!creatureSlug || !findCreature(creatureSlug)) {
    return NextResponse.json({ error: "Unknown creature." }, { status: 400 });
  }

  const benefits = getRankBenefits(session.user.rank as Rank);
  const count = await prisma.favorite.count({ where: { userId: session.user.id } });
  if (count >= benefits.maxFavorites) {
    return NextResponse.json(
      { error: `Your ${session.user.rank} rank allows up to ${benefits.maxFavorites} favorites. Upgrade for unlimited.` },
      { status: 403 },
    );
  }

  await prisma.favorite.upsert({
    where: { userId_creatureSlug: { userId: session.user.id, creatureSlug } },
    create: { userId: session.user.id, creatureSlug },
    update: {},
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { creatureSlug } = (await req.json().catch(() => ({}))) as { creatureSlug?: string };
  if (!creatureSlug) return NextResponse.json({ error: "Missing creatureSlug." }, { status: 400 });

  await prisma.favorite.deleteMany({ where: { userId: session.user.id, creatureSlug } });
  return NextResponse.json({ ok: true });
}
