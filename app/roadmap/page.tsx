"use client";

import Link from "next/link";
import { useLang, bi } from "@/lib/i18n";
import { roadmap, nextPackIdeas } from "@/lib/collections";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/motion";
import { Corners, P, dOf } from "@/components/shared";

export default function RoadmapPage() {
  const { t } = useLang();
  return (
    <PageShell accent="cyan">
      <div className="wrap" style={{ padding: "clamp(2.5rem,7vw,5rem) clamp(1rem,4vw,2.5rem) 5rem", maxWidth: 900 }}>
        <Reveal><Link href="/" className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "0.1em" }}>← HOME</Link></Reveal>
        <Reveal delay={1}><h1 className="section-title chrome" style={{ margin: "1.2rem 0 0.6rem" }}>{t(bi("What's coming next.", "次に生まれるもの。"))}</h1></Reveal>
        <Reveal delay={2}><P style={{ maxWidth: 640, marginBottom: "2.6rem" }}>{t(bi(
          "Real states only — no fake progress bars, no invented dates.",
          "実際の状態だけ表示します — 偽の進捗バーも、架空の日付もありません。",
        ))}</P></Reveal>

        <div style={{ display: "grid", gap: 10, marginBottom: "2.4rem" }}>
          {roadmap.map((r, i) => (
            <Reveal key={i} delay={dOf(i)}>
              <div className="holo" style={{ padding: "1.2rem 1.4rem", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <Corners />
                <span className="chip" style={{ minWidth: 64, justifyContent: "center" }}>{r.state}</span>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div className="font-display" style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text)" }}>{r.title}</div>
                  <P style={{ fontSize: "0.9rem" }}>{t(r.body)}</P>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>{t(bi("Pack ideas we're considering", "検討中のパック案"))}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
            {nextPackIdeas.map((p, i) => (
              <div key={i} className="holo" style={{ padding: "1.1rem 1.3rem" }}>
                <Corners />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="font-display" style={{ fontWeight: 700, fontSize: "0.94rem" }}>{p.name}</span>
                  <span className="font-mono" style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>{p.priceHint}</span>
                </div>
                <P style={{ fontSize: "0.86rem", marginTop: 6 }}>{t(p.body)}</P>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}
