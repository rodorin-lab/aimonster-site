import Link from "next/link";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getRankBenefits, type Rank } from "@/lib/rank";
import { findCreature, rarityAccent } from "@/lib/creatures";
import { Corners, RarityStars } from "@/components/shared";

export default async function FavoritesPage() {
  const session = await requireUser();
  const benefits = getRankBenefits(session.user.rank as Rank);
  const favorites = await prisma.favorite.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 4 }}>🐉 推しモン</h1>
      <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", marginBottom: 20 }}>
        {favorites.length} / {benefits.maxFavorites >= 999 ? "無制限" : benefits.maxFavorites}
      </p>
      {favorites.length === 0 ? (
        <p style={{ color: "var(--text-dim)" }}>
          まだいません。<Link href="/#codex" style={{ color: "var(--cyan)" }}>図鑑</Link>から気になる子を見つけて、詳細ページの「覚える」から登録できます。
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {favorites.map((f) => {
            const c = findCreature(f.creatureSlug);
            if (!c) return null;
            return (
              <div key={f.creatureSlug} className={`holo ${rarityAccent(c.rarity) === "gold" ? "ac-gold" : `ac-${rarityAccent(c.rarity)}`}`} style={{ padding: "1rem" }}>
                <Corners />
                <Link href={`/creatures/${c.slug}`} style={{ color: "var(--text)", textDecoration: "none", fontWeight: 800 }}>{c.name}</Link>
                <div style={{ marginTop: 4 }}><RarityStars rarity={c.rarity} /></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
