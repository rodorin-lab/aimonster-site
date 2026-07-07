import { NextResponse } from "next/server";
import Stripe from "stripe";

// Confirms a checkout session actually completed payment — used by the
// /success page before showing purchase confirmation. Never trust the
// session_id query param alone; always re-check with Stripe.

export async function GET(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  const stripe = new Stripe(key);
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      paid: session.payment_status === "paid",
      productId: session.metadata?.product_id ?? null,
    });
  } catch (err) {
    console.error("Session verification failed:", err);
    return NextResponse.json({ error: "Could not verify session." }, { status: 500 });
  }
}
