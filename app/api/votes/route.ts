import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRankBenefits, type Rank } from "@/lib/rank";
import { activeCampaign, findCampaign } from "@/lib/votes";

export async function GET() {
  const session = await auth();
  const tallies = await prisma.vote.groupBy({
    by: ["optionSlug"],
    where: { campaignSlug: activeCampaign.slug },
    _sum: { weight: true },
    _count: true,
  });
  const myVote = session?.user
    ? await prisma.vote.findUnique({ where: { userId_campaignSlug: { userId: session.user.id, campaignSlug: activeCampaign.slug } } })
    : null;

  return NextResponse.json({
    campaign: activeCampaign,
    tallies: tallies.map((t) => ({ optionSlug: t.optionSlug, points: t._sum.weight || 0, voters: t._count })),
    myVote: myVote?.optionSlug || null,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const benefits = getRankBenefits(session.user.rank as Rank);
  if (!benefits.canVote) {
    return NextResponse.json({ error: "SUPPORTER rank or higher is required to vote." }, { status: 403 });
  }

  const { campaignSlug, optionSlug } = (await req.json().catch(() => ({}))) as { campaignSlug?: string; optionSlug?: string };
  const campaign = campaignSlug ? findCampaign(campaignSlug) : undefined;
  if (!campaign || !campaign.options.some((o) => o.slug === optionSlug)) {
    return NextResponse.json({ error: "Unknown campaign or option." }, { status: 400 });
  }
  if (new Date() > new Date(campaign.endsAt)) {
    return NextResponse.json({ error: "This vote has closed." }, { status: 400 });
  }

  await prisma.vote.upsert({
    where: { userId_campaignSlug: { userId: session.user.id, campaignSlug: campaign.slug } },
    create: { userId: session.user.id, campaignSlug: campaign.slug, optionSlug: optionSlug!, weight: benefits.voteWeight },
    update: { optionSlug: optionSlug!, weight: benefits.voteWeight },
  });

  return NextResponse.json({ ok: true });
}
