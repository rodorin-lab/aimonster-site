"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Corners } from "@/components/shared";
import { SUBSCRIPTION_PRICING, getRankBenefits, type PaidRank, type Rank } from "@/lib/rank";

const RANKS: PaidRank[] = ["SUPPORTER", "KEEPER", "LEGEND"];

export default function BillingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const currentRank = (session?.user?.rank as Rank) || "RANCHER";

  async function subscribe(rank: PaidRank, interval: "month" | "year") {
    setLoading(`${rank}-${interval}`);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "subscription", rank, interval }),
    });
    const data = await res.json();
    setLoading(null);
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Could not start checkout.");
  }

  async function openPortal() {
    setLoading("portal");
    const res = await fetch("/api/portal", { method: "POST" });
    const data = await res.json();
    setLoading(null);
    if (data.url) window.location.href = data.url;
    else alert(data.error || "No active subscription found.");
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 6 }}>💳 サブスク管理</h1>
      <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", marginBottom: 20 }}>
        現在のランク: {getRankBenefits(currentRank).emoji} {currentRank} ・ いつでも1クリックで解約できます。
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {RANKS.map((rank) => {
          const pricing = SUBSCRIPTION_PRICING[rank];
          const b = getRankBenefits(rank);
          const isCurrent = currentRank === rank;
          return (
            <div key={rank} className={`holo ${rank === "LEGEND" ? "ac-gold" : "ac-orange"}`} style={{ padding: "1.2rem" }}>
              <Corners />
              <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{b.emoji}</div>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>{rank}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginBottom: 12 }}>
                {rank === "SUPPORTER" && "推しモン無制限・投票権・10%割引"}
                {rank === "KEEPER" && "投票の重み2倍・15%割引"}
                {rank === "LEGEND" && "月1リクエスト権・商用拡張ライセンス・20%割引"}
              </div>
              {isCurrent ? (
                <span className="chip" style={{ color: "var(--green)", borderColor: "var(--green)" }}>現在のランク</span>
              ) : (
                <div style={{ display: "grid", gap: 6 }}>
                  <button className="btn btn-solid" disabled={!!loading} onClick={() => subscribe(rank, "month")} style={{ cursor: "pointer", fontSize: "0.82rem" }}>
                    月額 ${pricing.monthlyUsd}
                  </button>
                  <button className="btn" disabled={!!loading} onClick={() => subscribe(rank, "year")} style={{ cursor: "pointer", fontSize: "0.78rem" }}>
                    年額 ${pricing.yearlyUsd} (2ヶ月分お得)
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {currentRank !== "RANCHER" && (
        <button className="btn" disabled={!!loading} onClick={openPortal} style={{ marginTop: 20, cursor: "pointer" }}>
          ▸ 支払い方法・解約の管理(Stripe)
        </button>
      )}
    </div>
  );
}
