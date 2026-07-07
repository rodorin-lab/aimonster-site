import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, siteUrl } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const sub = await prisma.subscription.findFirst({
    where: { userId: session.user.id, stripeCustomerId: { not: null } },
    orderBy: { createdAt: "desc" },
  });
  if (!sub?.stripeCustomerId) {
    return NextResponse.json({ error: "No active subscription found." }, { status: 404 });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${siteUrl(req)}/membership/billing`,
  });

  return NextResponse.json({ url: portal.url });
}
