"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useLang } from "@/lib/i18n";
import type { Creature } from "@/lib/creatures";
import { rarityAccent } from "@/lib/creatures";
import { findPack } from "@/lib/packs";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/motion";
import { Corners, RarityStars, ElementBadge, RoleBadge, useRemembered } from "@/components/shared";

const Creature3D = dynamic(() => import("@/components/Creature3D"), { ssr: false });

const STAGE_LABEL: Record<Creature["evolution"][number]["stage"], string> = {
  pixel: "PIXEL", anime: "ANIME", three_d: "3D", game: "GAME",
};

export default function CreatureDetail({ creature }: { creature: Creature }) {
  const { t } = useLang();
  const { has, toggle } = useRemembered();
  const remembered = has(creature.slug);
  const pack = creature.packSlug ? findPack(creature.packSlug) : undefined;
  const legend = creature.rarity === "LEGENDARY";
  const has3d = !!creature.model3d;

  return (
    <PageShell accent={rarityAccent(creature.rarity)}>
      <div className="wrap" style={{ padding: "clamp(2.5rem,7vw,4.5rem) clamp(1rem,4vw,2.5rem) 5rem", maxWidth: 980 }}>
        <Reveal><Link href="/#codex" className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "0.1em" }}>← {t({ en: "Codex", ja: "図鑑" })}</Link></Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.2fr)", gap: 28, marginTop: 20 }} className="researcher-grid">
          <Reveal>
            <div className={legend ? "holo-legend" : "holo"} style={{ position: "relative", aspectRatio: "1/1" }}>
              <Corners />
              {has3d
                ? <Creature3D src={creature.model3d!} />
                : <Image src={creature.image} alt={creature.name} fill sizes="(max-width: 900px) 90vw, 440px" style={{ objectFit: "contain" }} />}
            </div>
            {has3d && <p className="font-mono" style={{ textAlign: "center", fontSize: "0.7rem", color: "var(--text-faint)", marginTop: 8 }}>{t({ en: "Drag to rotate — real 3D prototype", ja: "ドラッグで回転 — 実物の3D試作モデル" })}</p>}
          </Reveal>

          <Reveal delay={1}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
              <h1 className={`font-display ${legend ? "chrome-gold" : "chrome"}`} style={{ fontSize: "clamp(1.8rem,4.5vw,2.6rem)", fontWeight: 800, letterSpacing: "0.02em" }}>{creature.name}</h1>
              <button onClick={() => toggle(creature.slug)} className="font-mono chip" style={{ cursor: "pointer", color: remembered ? "var(--ac)" : "var(--text-faint)" }}>
                {remembered ? "⌾ " : "○ "}{t({ en: "REMEMBER", ja: "覚える" })}
              </button>
            </div>
            <div className="font-mono" style={{ color: "var(--text-faint)", fontSize: "0.85rem", marginBottom: 14 }}>{t(creature.alias)}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              <ElementBadge element={creature.element} /><RoleBadge role={creature.role} />
              <span className="chip"><RarityStars rarity={creature.rarity} /></span>
            </div>

            <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 14px", marginBottom: 20 }}>
              <dt className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>PERSONALITY</dt>
              <dd style={{ margin: 0, color: "var(--text)", fontSize: "0.92rem" }}>{t(creature.personality)}</dd>
              <dt className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>ORIGIN</dt>
              <dd style={{ margin: 0, color: "var(--text)", fontSize: "0.92rem" }}>{t(creature.origin)}</dd>
              <dt className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>HABITAT</dt>
              <dd style={{ margin: 0, color: "var(--text)", fontSize: "0.92rem" }}>{t(creature.habitat)}</dd>
            </dl>

            <blockquote style={{ borderLeft: "2px solid var(--ac)", paddingLeft: 14, margin: "0 0 20px" }}>
              <p className="font-display neon" style={{ fontSize: "1.05rem", fontWeight: 600, margin: 0, whiteSpace: "pre-line" }}>{t(creature.quote)}</p>
            </blockquote>

            {pack && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link className="btn btn-solid ac-orange" href={`/packs/${pack.slug}`}>▸ {t({ en: "View pack", ja: "パックを見る" })} · ${pack.priceUsd}</Link>
              </div>
            )}
          </Reveal>
        </div>

        {/* Curator's note (Synchro voice) */}
        <Reveal delay={2}>
          <div className="holo ac-magenta" style={{ padding: "1.6rem 1.8rem", marginTop: "2.4rem" }}>
            <Corners />
            <div className="font-mono" style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--magenta)", marginBottom: 10 }}>◇ CURATOR&apos;S NOTE — SYNCHRO</div>
            <p className="font-display" style={{ whiteSpace: "pre-line", color: "var(--magenta)", fontSize: "1.02rem", fontWeight: 500, lineHeight: 1.6, margin: 0 }}>{t(creature.curatorNote)}</p>
          </div>
        </Reveal>

        {/* Evolution status */}
        <Reveal delay={3}>
          <div style={{ marginTop: "2.4rem" }}>
            <div className="kicker" style={{ marginBottom: 12 }}>{t({ en: "EVOLUTION STATUS", ja: "進化ステータス" })}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
              {creature.evolution.map((e, i) => (
                <div key={i} className="holo" style={{ padding: "0.9rem 1rem" }}>
                  <Corners />
                  <div className="font-mono" style={{ fontSize: "0.72rem", letterSpacing: "0.1em", color: e.state === "LIVE" || e.state === "PROTOTYPE" ? "var(--green)" : "var(--text-faint)" }}>
                    {STAGE_LABEL[e.stage]}
                  </div>
                  <div className="font-mono" style={{ fontSize: "0.66rem", color: "var(--text-faint)", marginTop: 4 }}>{e.state.replace("_", " ")}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}
