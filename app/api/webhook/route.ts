import { NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { RANK_UP_MESSAGE, getRankBenefits, type Rank } from "@/lib/rank";
import { sendRankUpEmail } from "@/lib/email";

// Verifies the Stripe webhook signature, then genuinely persists results:
// one-time pack purchases become Purchase rows with a real download token
// (see /api/download/[token]); subscription events create/update a
// Subscription row and update the user's rank, with a RankEvent audit row
// and a Synchro-voice congratulation email (spec Part 1.7 / 11.4).

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const payload = await req.text();
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const stripe = new Stripe(key);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode === "payment" && session.metadata?.product_id) {
        const userId = session.metadata.userId || null;
        if (userId) {
          await prisma.purchase.create({
            data: {
              userId,
              packSlug: session.metadata.product_id,
              stripePaymentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
              amountCents: session.amount_total || 0,
              currency: session.currency || "usd",
              status: "succeeded",
              downloadToken: crypto.randomBytes(24).toString("hex"),
              downloadExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
            },
          });
        }
      }

      if (session.mode === "subscription" && session.metadata?.userId) {
        await upsertSubscriptionFromStripe(stripe, session.metadata.userId, session.subscription as string, session.customer as string);
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (userId) {
        await upsertSubscriptionFromStripe(stripe, userId, sub.id, sub.customer as string, sub);
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function upsertSubscriptionFromStripe(
  stripe: Stripe,
  userId: string,
  stripeSubscriptionId: string,
  stripeCustomerId: string,
  preloaded?: Stripe.Subscription,
) {
  const sub = preloaded ?? (await stripe.subscriptions.retrieve(stripeSubscriptionId));
  const rank = (sub.metadata?.rank as Rank) || "SUPPORTER";
  const status = sub.status;
  const item = sub.items.data[0];

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId: item?.price.id || null,
      status,
      currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
      rank,
      cancelAtPeriodEnd: sub.cancel_at_period_end || false,
    },
    update: {
      status,
      currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
      cancelAtPeriodEnd: sub.cancel_at_period_end || false,
    },
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const newRank: Rank = status === "active" || status === "trialing" ? rank : "RANCHER";
  if (user.rank !== newRank) {
    await prisma.user.update({ where: { id: userId }, data: { rank: newRank } });
    await prisma.rankEvent.create({
      data: { userId, fromRank: user.rank, toRank: newRank, reason: "subscription" },
    });
    const message = RANK_UP_MESSAGE[newRank];
    if (message.en) {
      await sendRankUpEmail(user.email, `${getRankBenefits(newRank).emoji} ${newRank}`);
    }
  }
}
