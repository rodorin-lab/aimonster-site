import Link from "next/link";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getRankBenefits, RANK_HIERARCHY, SUBSCRIPTION_PRICING, type Rank } from "@/lib/rank";
import { findCreature } from "@/lib/creatures";
import { activeCampaign } from "@/lib/votes";
import { Corners } from "@/components/shared";

export default async function MembershipDashboard() {
  const session = await requireUser();
  const rank = session.user.rank as Rank;
  const benefits = getRankBenefits(rank);

  const [favorites, votedAlready] = await Promise.all([
    prisma.favorite.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.vote.findUnique({ where: { userId_campaignSlug: { userId: session.user.id, campaignSlug: activeCampaign.slug } } }),
  ]);

  const rankIdx = RANK_HIERARCHY.indexOf(rank);
  const nextRank = RANK_HIERARCHY[rankIdx + 1] as Rank | undefined;
  const daysLeft = Math.max(0, Math.ceil((new Date(activeCampaign.endsAt).getTime() - Date.now()) / 86400000));

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div className="holo ac-magenta" style={{ padding: "1.6rem" }}>
        <Corners />
        <h1 className="font-display" style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 4px" }}>
          🐾 ようこそ、{session.user.name || session.user.email}さん
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", margin: 0 }}>
          {benefits.emoji} {rank} ・ {session.user.points}pt
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
        <StatBox label="推しモン" value={`${favorites.length} / ${benefits.maxFavorites >= 999 ? "∞" : benefits.maxFavorites}`} />
        <StatBox label="投票" value={benefits.canVote ? (votedAlready ? "投票済み" : `あと${daysLeft}日`) : "SUPPORTER以上"} />
        <StatBox label="割引率" value={benefits.discount > 0 ? `${benefits.discount * 100}%` : "—"} />
      </div>

      <section>
        <h2 className="font-mono" style={{ fontSize: "0.8rem", color: "var(--text-faint)", letterSpacing: "0.08em", marginBottom: 10 }}>
          ━━ 推せるクリーチャー ━━━━━━━━━━━━
        </h2>
        {favorites.length === 0 ? (
          <p style={{ color: "var(--text-dim)", fontSize: "0.88rem" }}>
            まだ推しモンがいません。<Link href="/#codex" style={{ color: "var(--cyan)" }}>図鑑</Link>から見つけよう。
          </p>
        ) : (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {favorites.map((f) => {
              const c = findCreature(f.creatureSlug);
              if (!c) return null;
              return (
                <Link key={f.creatureSlug} href={`/creatures/${c.slug}`} className="chip" style={{ textDecoration: "none" }}>
                  {c.name}
                </Link>
              );
            })}
            <Link href="/membership/favorites" className="chip" style={{ color: "var(--cyan)" }}>+ もっと見る</Link>
          </div>
        )}
      </section>

      {nextRank && (
        <div className="holo ac-orange" style={{ padding: "1.4rem" }}>
          <Corners />
          <p style={{ margin: "0 0 10px", fontSize: "0.9rem" }}>
            次のランク <strong>{nextRank}</strong> になると、
            {nextRank === "SUPPORTER" && " 推しモン無制限 + 投票権 + 10%割引。"}
            {nextRank === "KEEPER" && " 15%割引 + より多くの投票の重み。"}
            {nextRank === "LEGEND" && " 月1リクエスト権 + 商用拡張ライセンス + 20%割引。"}
          </p>
          <Link href="/membership/billing" className="btn btn-solid ac-orange">
            ▸ {nextRank in SUBSCRIPTION_PRICING ? `月額 $${SUBSCRIPTION_PRICING[nextRank as keyof typeof SUBSCRIPTION_PRICING].monthlyUsd} で始める` : "アップグレード"}
          </Link>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="holo ac-cyan" style={{ padding: "1rem", textAlign: "center" }}>
      <Corners />
      <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--text-faint)", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: "1.3rem", fontWeight: 800, marginTop: 4 }}>{value}</div>
    </div>
  );
}
