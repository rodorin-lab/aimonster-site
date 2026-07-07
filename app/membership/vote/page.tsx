"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Corners } from "@/components/shared";
import type { VoteCampaign } from "@/lib/votes";

type Tally = { optionSlug: string; points: number; voters: number };

export default function VotePage() {
  const { data: session } = useSession();
  const [campaign, setCampaign] = useState<VoteCampaign | null>(null);
  const [tallies, setTallies] = useState<Tally[]>([]);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canVote = session?.user && ["SUPPORTER", "KEEPER", "LEGEND"].includes(session.user.rank);

  async function load() {
    const res = await fetch("/api/votes");
    const data = await res.json();
    setCampaign(data.campaign);
    setTallies(data.tallies);
    setMyVote(data.myVote);
  }
  useEffect(() => { load(); }, []);

  async function cast(optionSlug: string) {
    setError(null);
    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignSlug: campaign!.slug, optionSlug }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    load();
  }

  if (!campaign) return null;
  const totalPoints = tallies.reduce((s, t) => s + t.points, 0) || 1;
  const totalVoters = tallies.reduce((s, t) => s + t.voters, 0);

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 6 }}>🗳️ {campaign.title.ja}</h1>
      <p style={{ color: "var(--text-dim)", fontSize: "0.88rem", marginBottom: 20 }}>{campaign.description.ja}</p>

      {!canVote && (
        <p style={{ color: "var(--orange)", fontSize: "0.85rem", marginBottom: 16 }}>
          投票にはSUPPORTER以上のランクが必要です。<Link href="/membership/billing" style={{ color: "var(--cyan)" }}>アップグレード →</Link>
        </p>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {campaign.options.map((o) => {
          const t = tallies.find((x) => x.optionSlug === o.slug);
          const pct = t ? Math.round((t.points / totalPoints) * 100) : 0;
          const mine = myVote === o.slug;
          return (
            <div key={o.slug} className="holo ac-cyan" style={{ padding: "0.9rem 1.1rem" }}>
              <Corners />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span>{o.emoji} {o.label.ja} {mine && <span style={{ color: "var(--green)" }}>✓ あなたの1票</span>}</span>
                <span className="font-mono" style={{ fontSize: "0.78rem", color: "var(--text-faint)" }}>{t?.points || 0}pt ({t?.voters || 0}票)</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "var(--cyan)" }} />
              </div>
              {canVote && (
                <button
                  className={mine ? "btn btn-solid ac-green" : "btn"}
                  onClick={() => cast(o.slug)}
                  style={{ fontSize: "0.78rem", padding: "0.35em 0.9em", cursor: "pointer" }}
                >
                  {mine ? "投票済み" : "▸ これに投票"}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {error && <p style={{ color: "var(--magenta)", marginTop: 10 }}>⚠ {error}</p>}
      <p className="font-mono" style={{ fontSize: "0.75rem", color: "var(--text-faint)", marginTop: 14 }}>
        合計 {totalPoints}pt ({totalVoters}人が投票) ・ 締切 {new Date(campaign.endsAt).toLocaleDateString("ja-JP")}
      </p>
    </div>
  );
}
