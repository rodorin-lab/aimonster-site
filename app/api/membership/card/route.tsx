import { ImageResponse } from "next/og";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRankBenefits, type Rank } from "@/lib/rank";
import { findCreature } from "@/lib/creatures";

export const runtime = "nodejs";

const RANK_HEX: Record<string, string> = { RANCHER: "#00ff5a", SUPPORTER: "#ff8a2a", KEEPER: "#00fff0", LEGEND: "#ffd700" };

export async function GET() {
  const session = await auth();
  if (!session?.user) return new Response("Not signed in.", { status: 401 });

  const [user, topFavorite] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.favorite.findFirst({ where: { userId: session.user.id }, orderBy: { createdAt: "asc" } }),
  ]);
  if (!user) return new Response("User not found.", { status: 404 });

  const rank = user.rank as Rank;
  const color = RANK_HEX[rank] || "#00fff0";
  const benefits = getRankBenefits(rank);
  const creature = topFavorite ? findCreature(topFavorite.creatureSlug) : null;
  const memberId = `GM-${new Date(user.createdAt).getFullYear()}-${user.id.slice(-6).toUpperCase()}`;

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        background: "#05070d", color: "#e8f0ff", padding: 48,
        fontFamily: "sans-serif", border: `4px solid ${color}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 800, color }}>
          <span>{benefits.emoji}</span><span>{rank}</span>
        </div>
        <div style={{ width: "100%", height: 2, background: color, opacity: 0.4, margin: "20px 0" }} />
        <div style={{ display: "flex", fontSize: 36, fontWeight: 800 }}>{user.name || user.email}</div>
        <div style={{ display: "flex", fontSize: 18, color: "#8a9bc0", marginTop: 8 }}>
          加入: {new Date(user.createdAt).toLocaleDateString("ja-JP")} ・ ID: {memberId}
        </div>
        <div style={{ width: "100%", height: 2, background: color, opacity: 0.4, margin: "20px 0" }} />
        <div style={{ display: "flex", fontSize: 20 }}>
          推しモン: {creature ? `${creature.name} ${creature.element === "FIRE" ? "🐉" : ""}` : "未登録"}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ width: "100%", height: 2, background: color, opacity: 0.4, margin: "20px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, color: "#8a9bc0" }}>
          <span>AI MONSTER FACTORY</span>
          <span>ロドリンとグラムのクリーチャー牧場</span>
        </div>
      </div>
    ),
    { width: 700, height: 420 },
  );
}
