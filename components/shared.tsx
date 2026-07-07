"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang, type Bi } from "@/lib/i18n";
import { Reveal } from "@/components/motion";
import type { Accent } from "@/lib/content";
import type { Creature, Rarity } from "@/lib/creatures";
import { rarityStars, rarityAccent } from "@/lib/creatures";
import type { Pack } from "@/lib/packs";

export const acClass = (a: Accent) => `ac-${a}`;
export const dOf = (i: number) => (Math.min(i, 3) + 1) as 1 | 2 | 3 | 4;

export function Corners() {
  return (<><span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" /><span className="scan" /></>);
}

export function P({ children, style }: { children: string; style?: React.CSSProperties }) {
  return <p style={{ whiteSpace: "pre-line", color: "var(--text-dim)", lineHeight: 1.85, ...style }}>{children}</p>;
}

export function Head({ eyebrow, title, lead }: { eyebrow: string; title: Bi; lead?: Bi }) {
  const { t } = useLang();
  return (
    <div style={{ marginBottom: "2.6rem" }}>
      <Reveal><div className="kicker" style={{ marginBottom: 12 }}>{eyebrow}</div></Reveal>
      <Reveal delay={1}><h2 className="section-title chrome" style={{ margin: "0.4rem 0 0.8rem", whiteSpace: "pre-line" }}>{t(title)}</h2></Reveal>
      {lead && <Reveal delay={2}><P style={{ maxWidth: 700, fontSize: "1.05rem" }}>{t(lead)}</P></Reveal>}
    </div>
  );
}

export function RarityStars({ rarity }: { rarity: Rarity }) {
  const n = rarityStars[rarity];
  const isLegend = rarity === "LEGENDARY";
  return (
    <span className={isLegend ? "rarity-stars" : ""} style={{ color: isLegend ? undefined : "var(--magenta)", fontSize: "0.85rem" }}>
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

export function ElementBadge({ element }: { element: string }) {
  return <span className="chip ac-cyan">{element}</span>;
}

export function RoleBadge({ role }: { role: string }) {
  return <span className="chip ac-magenta">{role}</span>;
}

// REMEMBER — a real, local (no fake counters) favoriting feature.
export function useRemembered() {
  const [set, setSet] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const raw = localStorage.getItem("amf-remembered");
      if (raw) setSet(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
  }, []);
  const toggle = (slug: string) => {
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      try { localStorage.setItem("amf-remembered", JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };
  return { remembered: set, toggle, has: (slug: string) => set.has(slug), count: set.size };
}

export function CreatureCard({ creature, delay = 0 }: { creature: Creature; delay?: 0 | 1 | 2 | 3 | 4 }) {
  const { t } = useLang();
  const { has, toggle } = useRemembered();
  const remembered = has(creature.slug);
  const legend = creature.rarity === "LEGENDARY";
  return (
    <Reveal delay={delay} className={acClass(rarityAccent(creature.rarity))}>
      <div className={legend ? "holo-legend" : "holo"} style={{ padding: "1.4rem", height: "100%", position: "relative" }}>
        <Corners />
        <button
          onClick={(e) => { e.preventDefault(); toggle(creature.slug); }}
          aria-label="Remember this creature"
          className="font-mono"
          style={{ position: "absolute", top: 14, right: 14, zIndex: 2, background: "none", border: "1px solid rgba(var(--ac-rgb),0.4)", borderRadius: 999, padding: "3px 9px", fontSize: 11, cursor: "pointer", color: remembered ? "var(--ac)" : "var(--text-faint)" }}
        >
          {remembered ? "⌾ " : "○ "}{t({ en: "REMEMBER", ja: "覚える" })}
        </button>
        <Link href={`/creatures/${creature.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", marginBottom: 14, borderRadius: 4, overflow: "hidden", background: "rgba(0,0,0,0.3)" }}>
            <Image src={creature.image} alt={creature.name} fill sizes="(max-width: 640px) 90vw, 320px" style={{ objectFit: "contain" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
            <h3 className={`font-display ${legend ? "chrome-gold" : "neon"}`} style={{ fontSize: "1.08rem", fontWeight: 800, letterSpacing: "0.03em" }}>{creature.name}</h3>
            <RarityStars rarity={creature.rarity} />
          </div>
          <div className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginBottom: 10 }}>{t(creature.alias)}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <ElementBadge element={creature.element} />
            <RoleBadge role={creature.role} />
          </div>
        </Link>
      </div>
    </Reveal>
  );
}

export function PackCard({ pack, delay = 0 }: { pack: Pack; delay?: 0 | 1 | 2 | 3 | 4 }) {
  const { t } = useLang();
  const legend = pack.accent === "gold";
  return (
    <Reveal delay={delay} className={acClass(pack.accent)}>
      <Link href={`/packs/${pack.slug}`} className={legend ? "holo-legend" : "holo"} style={{ display: "block", padding: "1.4rem", height: "100%", textDecoration: "none" }}>
        <Corners />
        <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", marginBottom: 14, borderRadius: 4, overflow: "hidden", background: "rgba(0,0,0,0.3)" }}>
          <Image src={pack.image} alt={pack.name} fill sizes="(max-width: 640px) 90vw, 360px" style={{ objectFit: "cover" }} />
        </div>
        <h3 className={`font-display ${legend ? "chrome-gold" : ""}`} style={{ fontSize: "1.05rem", fontWeight: 700, color: legend ? undefined : "var(--text)", marginBottom: 8 }}>{pack.name}</h3>
        <P style={{ fontSize: "0.88rem", marginBottom: 12 }}>{t(pack.forWho)}</P>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="font-display neon" style={{ fontSize: "1.3rem", fontWeight: 800 }}>${pack.priceUsd.toFixed(2).replace(/\.00$/, "")}</span>
          <span className="font-mono" style={{ fontSize: "0.72rem", color: "var(--ac)", letterSpacing: "0.08em" }}>{t({ en: "VIEW PACK →", ja: "パックを見る →" })}</span>
        </div>
      </Link>
    </Reveal>
  );
}
