import { NextResponse } from "next/server";
import { findPack } from "@/lib/packs";
import { SUBSCRIPTION_PRICING, type PaidRank } from "@/lib/rank";
import { getStripe, siteUrl } from "@/lib/stripe";
import { auth } from "@/lib/auth";

type PackBody = { kind?: "pack"; product_id: string };
type SubscriptionBody = { kind: "subscription"; rank: PaidRank; interval: "month" | "year" };

export async function POST(req: Request) {
  let body: PackBody | SubscriptionBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    console.error("Stripe not configured:", err);
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }
  const base = siteUrl(req);

  if (body.kind === "subscription") {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    const pricing = SUBSCRIPTION_PRICING[body.rank];
    if (!pricing || !["month", "year"].includes(body.interval)) {
      return NextResponse.json({ error: "Unknown rank or interval." }, { status: 400 });
    }
    const amountUsd = body.interval === "month" ? pricing.monthlyUsd : pricing.yearlyUsd;

    try {
      // Inline recurring price_data — no pre-registered Stripe Price ID
      // needed (documented spec adjustment: those 6 Price IDs don't exist
      // in the Stripe dashboard yet, so build the price at checkout time
      // instead of blocking on dashboard setup).
      const checkout = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: session.user.email || undefined,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: `AI MONSTER FACTORY — ${body.rank}` },
              unit_amount: Math.round(amountUsd * 100),
              recurring: { interval: body.interval },
            },
            quantity: 1,
          },
        ],
        success_url: `${base}/membership/welcome?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${base}/membership/billing`,
        allow_promotion_codes: true,
        metadata: { userId: session.user.id, rank: body.rank, interval: body.interval, source: "aimonster-factory-v2" },
        subscription_data: { metadata: { userId: session.user.id, rank: body.rank } },
      });
      return NextResponse.json({ url: checkout.url });
    } catch (err) {
      console.error("Stripe subscription checkout failed:", err);
      return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
    }
  }

  // ── Existing one-time pack purchase flow ──
  const productId = body.product_id;
  if (!productId) {
    return NextResponse.json({ error: "product_id is required" }, { status: 400 });
  }
  const pack = findPack(productId);
  if (!pack) {
    return NextResponse.json({ error: `Unknown product: ${productId}` }, { status: 400 });
  }
  if (!pack.checkoutId) {
    return NextResponse.json({ error: "This product is not available for purchase yet." }, { status: 400 });
  }

  const origin =
    typeof pack.image === "string" && pack.image.startsWith("/")
      ? `${base}${pack.image}`
      : pack.image;

  const authSession = await auth();

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: authSession?.user?.email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: pack.name,
              description: `AI MONSTER FACTORY — ${pack.name}`,
              images: [origin],
            },
            unit_amount: Math.round(pack.priceUsd * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/packs/${pack.slug}`,
      allow_promotion_codes: true,
      metadata: { product_id: pack.checkoutId, userId: authSession?.user?.id || "", source: "aimonster-factory-v2" },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
