import { bi, type Bi } from "./bi";

export type VoteOption = { slug: string; label: Bi; emoji: string };
export type VoteCampaign = {
  slug: string;
  title: Bi;
  description: Bi;
  options: VoteOption[];
  startsAt: string; // ISO date
  endsAt: string; // ISO date
  minRank: "SUPPORTER" | "RANCHER"; // matches spec permission matrix: RANCHER can't vote, SUPPORTER+ can
};

// One real, currently-open campaign — matches spec's "NEXT_DRAGON_V1" example.
// SUPPORTER+ only, per the spec's permission matrix (RANCHER cannot vote).
export const activeCampaign: VoteCampaign = {
  slug: "next-dragon-v1",
  title: bi("Which fire-adjacent creature should we build next?", "次に作るべき火属性系クリーチャーは?"),
  description: bi(
    "Pick one. The winner becomes the next Codex entry we actually commit to building.",
    "1つ選んでください。1位になった案を、次に実際に作るクリーチャーとして正式に着手します。",
  ),
  options: [
    { slug: "thunder-elemental", label: bi("Thunder Elemental", "サンダーエレメンタル"), emoji: "⚡" },
    { slug: "crystal-golem", label: bi("Crystal Golem", "クリスタルゴーレム"), emoji: "💎" },
    { slug: "void-phoenix", label: bi("Void Phoenix", "ヴォイドフェニックス"), emoji: "🦅" },
    { slug: "wind-serpent", label: bi("Wind Serpent", "ウィンドサーペント"), emoji: "🐍" },
  ],
  startsAt: "2026-07-01T00:00:00Z",
  endsAt: "2026-07-21T23:59:59Z",
  minRank: "SUPPORTER",
};

export function findCampaign(slug: string): VoteCampaign | undefined {
  return slug === activeCampaign.slug ? activeCampaign : undefined;
}
