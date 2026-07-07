import { bi, type Bi } from "./bi";
import type { Accent } from "./content";

// Membership ranks. VISITOR is anyone not logged in (not a DB value).
// Logged-in users start at RANCHER; SUPPORTER/KEEPER/LEGEND come from an
// active subscription (lib/rank.ts is the single source of truth for the
// hierarchy so admin + membership pages never disagree on ordering).
export const RANK_HIERARCHY = ["VISITOR", "RANCHER", "SUPPORTER", "KEEPER", "LEGEND"] as const;
export type Rank = (typeof RANK_HIERARCHY)[number];
export type PaidRank = "SUPPORTER" | "KEEPER" | "LEGEND";

export type SubscriptionLike = { status: string; rank: string } | null | undefined;

export function determineRankFromSubscription(sub: SubscriptionLike): Rank {
  if (!sub || sub.status !== "active") return "RANCHER";
  if (sub.rank === "SUPPORTER" || sub.rank === "KEEPER" || sub.rank === "LEGEND") return sub.rank;
  return "RANCHER";
}

export type RankBenefits = {
  emoji: string;
  color: string; // CSS var name suffix, matches globals.css accents where possible
  accent: Accent;
  maxFavorites: number; // Infinity-like via 999
  canVote: boolean;
  voteWeight: number;
  canComment: boolean;
  canRequest: boolean;
  discount: number; // 0..1
  label: Bi;
};

export const RANK_BENEFITS: Record<Rank, RankBenefits> = {
  VISITOR: { emoji: "🌱", color: "text-faint", accent: "cyan", maxFavorites: 0, canVote: false, voteWeight: 0, canComment: false, canRequest: false, discount: 0, label: bi("Visitor", "訪問者") },
  RANCHER: { emoji: "🌿", color: "green", accent: "green", maxFavorites: 5, canVote: false, voteWeight: 0, canComment: false, canRequest: false, discount: 0, label: bi("Rancher", "牧場員") },
  SUPPORTER: { emoji: "🥉", color: "orange", accent: "orange", maxFavorites: 999, canVote: true, voteWeight: 1, canComment: true, canRequest: false, discount: 0.10, label: bi("Supporter", "サポーター") },
  KEEPER: { emoji: "🥈", color: "cyan", accent: "cyan", maxFavorites: 999, canVote: true, voteWeight: 2, canComment: true, canRequest: false, discount: 0.15, label: bi("Keeper", "キーパー") },
  LEGEND: { emoji: "🥇", color: "gold", accent: "gold", maxFavorites: 999, canVote: true, voteWeight: 5, canComment: true, canRequest: true, discount: 0.20, label: bi("Legend", "レジェンド") },
};

export function getRankBenefits(rank: Rank): RankBenefits {
  return RANK_BENEFITS[rank];
}

// Subscription price table (spec Part 3.3). Used both for display and to
// build Stripe Checkout Sessions with inline recurring price_data — no
// pre-registered Stripe Price IDs required (see lib/stripe-plans.ts).
export const SUBSCRIPTION_PRICING: Record<PaidRank, { monthlyUsd: number; yearlyUsd: number }> = {
  SUPPORTER: { monthlyUsd: 5, yearlyUsd: 50 },
  KEEPER: { monthlyUsd: 15, yearlyUsd: 150 },
  LEGEND: { monthlyUsd: 50, yearlyUsd: 500 },
};

// Synchro-voice congratulations shown once per rank-up (spec Part 1.7).
export const RANK_UP_MESSAGE: Record<Rank, Bi> = {
  VISITOR: bi("", ""),
  RANCHER: bi("Welcome to the Ranch! Your journey starts here 🐾", "ようこそ、牧場へ！ここからあなたの旅が始まります🐾"),
  SUPPORTER: bi("Welcome to SUPPORTER! Your support helps the lab evolve 💪", "SUPPORTERへようこそ！あなたの応援が、ラボを進化させます💪"),
  KEEPER: bi("Promoted to KEEPER! You're a genuinely core member now 🌟", "KEEPERに昇格！あなたは本当にコアな推し活メンバーです🌟"),
  LEGEND: bi("Welcome to LEGEND... you've gone beyond being just a member 🐉✨", "LEGENDへようこそ……あなたは、もう私たちの仲間の域を超えました🐉✨"),
};
