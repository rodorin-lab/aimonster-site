"use client";

import Link from "next/link";
import { useLang, bi } from "@/lib/i18n";
import { ranch } from "@/lib/content";
import { ranchLog } from "@/lib/collections";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/motion";
import { Corners, Head, P, dOf } from "@/components/shared";

export default function RanchPage() {
  const { t } = useLang();
  return (
    <PageShell accent="green">
      <div className="wrap" style={{ padding: "clamp(2.5rem,7vw,5rem) clamp(1rem,4vw,2.5rem) 5rem", maxWidth: 900 }}>
        <Reveal><Link href="/" className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "0.1em" }}>← HOME</Link></Reveal>
        <div style={{ marginTop: 20 }}>
          <Head eyebrow={ranch.eyebrow} title={ranch.heading} lead={ranch.lead} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: "2rem" }}>
          {ranch.phase1.map((p, i) => (
            <Reveal key={i} delay={dOf(i)}>
              <div className="holo" style={{ padding: "1.1rem 1.3rem", textAlign: "center" }}>
                <Corners />
                <span style={{ color: "var(--text)", fontSize: "0.92rem" }}>{t(p)}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="holo" style={{ padding: "1.4rem 1.6rem", opacity: 0.8, marginBottom: "2.4rem" }}>
            <Corners />
            <div className="kicker" style={{ marginBottom: 10 }}>{t(ranch.future.label)}</div>
            <P style={{ fontSize: "0.88rem", marginBottom: 6 }}>{t(ranch.future.phase2)}</P>
            <P style={{ fontSize: "0.88rem" }}>{t(ranch.future.phase3)}</P>
          </div>
        </Reveal>

        <div className="kicker" style={{ marginBottom: 14 }}>{t(bi("Ranch Log — full history", "牧場ログ — 全履歴"))}</div>
        <div style={{ display: "grid", gap: 14 }}>
          {ranchLog.map((entry, i) => (
            <Reveal key={i} delay={dOf(i)}>
              <div className="holo ac-green" style={{ padding: "1.3rem 1.5rem" }}>
                <Corners />
                <div className="font-mono neon" style={{ fontSize: "0.78rem", marginBottom: 10 }}>{entry.date}</div>
                <LogBlock label={t(bi("Done", "できた"))} items={entry.done} />
                <LogBlock label={t(bi("Broken", "壊れた"))} items={entry.broken} />
                <LogBlock label={t(bi("Next", "次"))} items={entry.next} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function LogBlock({ label, items }: { label: string; items: import("@/lib/i18n").Bi[] }) {
  const { t } = useLang();
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--text-faint)", letterSpacing: "0.1em", marginBottom: 4 }}>{label}:</div>
      {items.map((it, i) => <div key={i} style={{ color: "var(--text)", fontSize: "0.88rem" }}>- {t(it)}</div>)}
    </div>
  );
}
