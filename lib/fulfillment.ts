import type Stripe from "stripe";
import { prisma } from "./prisma";
import { findPack } from "./packs";
import { readRelease } from "./delivery";
import { sendPurchaseEmail } from "./email";
import { fulfillPack as fulfill } from "./fulfillment-core";

export function fulfillPack(session: Stripe.Checkout.Session) {
  return fulfill(session, { prisma, findPack, readRelease, sendPurchaseEmail });
}
