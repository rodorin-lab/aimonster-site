"use client";

import { useLang } from "@/lib/i18n";
import type { Block } from "@/lib/collections";

export function BlockView({ block }: { block: Block }) {
  const { t } = useLang();
  switch (block.t) {
    case "h":
      return <h2 className="font-display neon" style={{ fontSize: "clamp(1.3rem,3.5vw,1.9rem)", fontWeight: 700, margin: "2rem 0 0.6rem", whiteSpace: "pre-line" }}>{t(block.text)}</h2>;
    case "p":
      return <p style={{ whiteSpace: "pre-line", color: "var(--text)", fontSize: "1.06rem", lineHeight: 1.9, margin: "0 0 1.1rem" }}>{t(block.text)}</p>;
    case "callout":
      return (
        <div className="holo" style={{ padding: "1.2rem 1.4rem", margin: "1.4rem 0", borderLeft: "3px solid var(--ac)" }}>
          <p style={{ whiteSpace: "pre-line", color: "var(--text)", margin: 0, fontSize: "1rem", lineHeight: 1.8 }}>{t(block.text)}</p>
        </div>
      );
    case "quote": {
      const isSyn = block.who === "SYNCHRO";
      const col = isSyn ? "var(--magenta)" : "var(--cyan)";
      return (
        <blockquote className={isSyn ? "ac-magenta" : "ac-cyan"} style={{ margin: "1.6rem 0", padding: "1.2rem 1.5rem", borderLeft: `3px solid ${col}`, background: "rgba(10,15,26,0.5)" }}>
          <div className="font-mono" style={{ fontSize: "0.68rem", letterSpacing: "0.2em", color: col, marginBottom: 8 }}>◇ {block.who}</div>
          <p className="font-display" style={{ whiteSpace: "pre-line", color: col, fontSize: "clamp(1.05rem,2.4vw,1.35rem)", fontWeight: 600, lineHeight: 1.55, margin: 0 }}>{t(block.text)}</p>
        </blockquote>
      );
    }
  }
}
