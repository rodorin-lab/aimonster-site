import Link from "next/link";
import { requireUser } from "@/lib/permissions";
import { getRankBenefits, RANK_UP_MESSAGE, type Rank } from "@/lib/rank";
import { Corners } from "@/components/shared";

export default async function WelcomePage() {
  const session = await requireUser();
  const rank = session.user.rank as Rank;
  const b = getRankBenefits(rank);
  const message = RANK_UP_MESSAGE[rank];

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", textAlign: "center" }}>
      <div className={rank === "LEGEND" ? "holo-legend" : "holo ac-magenta"} style={{ padding: "2rem" }}>
        <Corners />
        <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{b.emoji}</div>
        <h1 className="font-display chrome" style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 12 }}>{rank}</h1>
        <p style={{ color: "var(--text-dim)", lineHeight: 1.7 }}>{message.ja || "ようこそ！"}</p>
        <Link href="/membership" className="btn btn-solid ac-magenta" style={{ marginTop: 20, display: "inline-block" }}>
          ▸ ダッシュボードへ
        </Link>
      </div>
    </div>
  );
}
