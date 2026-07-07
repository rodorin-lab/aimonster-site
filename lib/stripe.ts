import Stripe from "stripe";

// Security guardrail (CLAUDE.md): the Stripe secret key is read ONLY from
// the environment. Never hardcode it, never read the old project's
// .env.local. If a key value is needed, ask the operator directly.
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key);
}

export function siteUrl(req: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
}
