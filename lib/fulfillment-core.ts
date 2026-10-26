import type Stripe from "stripe";
import crypto from "node:crypto";
import type { prisma } from "./prisma";
import type { findPack } from "./packs";
import type { readRelease } from "./delivery";
import type { sendPurchaseEmail } from "./email";

type Dependencies = {
  prisma: typeof prisma;
  findPack: typeof findPack;
  readRelease: typeof readRelease;
  sendPurchaseEmail: typeof sendPurchaseEmail;
};

export async function fulfillPack(session: Stripe.Checkout.Session, deps: Dependencies) {
  const { prisma, findPack, readRelease, sendPurchaseEmail } = deps;
  if (session.mode !== "payment" || !["paid", "no_payment_required"].includes(session.payment_status)) return;
  if (session.metadata?.source !== "aimonster-factory-v2") return;
  const pack = findPack(session.metadata?.product_id || "");
  const email = session.customer_details?.email || session.customer_email;
  if (!pack || !email) throw new Error("Missing pack or buyer email");
  // Persist the paid order even if an old checkout's files are unavailable.
  const purchase = await prisma.purchase.upsert({
    where: { stripeSessionId: session.id },
    update: {},
    create: {
      stripeSessionId: session.id,
      userId: session.metadata?.userId || null,
      buyerEmail: email,
      packSlug: pack.slug,
      deliverySha256: session.metadata?.delivery_sha256 || null,
      stripePaymentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
      amountCents: session.amount_total ?? 0,
      currency: session.currency || "usd",
      status: "succeeded",
      downloadToken: crypto.randomBytes(24).toString("hex"),
      downloadExpiresAt: new Date(Date.now() + 30 * 86400000),
    },
  });
  if (purchase.status !== "succeeded" || purchase.deliveryEmailSentAt) return;
  const release = await readRelease(purchase.packSlug, purchase.deliverySha256);
  if (!purchase.deliverySha256) {
    await prisma.purchase.update({ where: { id: purchase.id }, data: { deliverySha256: crypto.createHash("sha256").update(release.bytes).digest("hex") } });
  }
  await sendPurchaseEmail(purchase.buyerEmail!, purchase.downloadToken!, session.id);
  await prisma.purchase.update({ where: { id: purchase.id }, data: { deliveryEmailSentAt: new Date() } });
}
