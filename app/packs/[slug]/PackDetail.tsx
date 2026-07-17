"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useLang, bi } from "@/lib/i18n";
import type { Pack } from "@/lib/packs";
import { findCreature } from "@/lib/creatures";
import { findStory } from "@/lib/collections";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/motion";
import { Corners, P } from "@/components/shared";
import StarterPackVisual from "@/components/StarterPackVisual";

const Creature3D = dynamic(() => import("@/components/Creature3D"), { ssr: false });

const faq = [
  { q: bi("Can I use this in a commercial game?", "商用ゲームで使えますか？"), a: bi("Yes — every pack here includes a commercial-use license unless stated otherwise on this page.", "はい — このページに明記がない限り、全パックに商用利用ライセンスが含まれます。") },
  { q: bi("Do I need attribution?", "クレジット表記は必要ですか？"), a: bi("No attribution required. It's appreciated, never mandatory.", "クレジット表記は不要です。あれば嬉しいですが、義務ではありません。") },
  { q: bi("What if the download link breaks?", "ダウンロードリンクが切れたら？"), a: bi("Email support within 30 days of purchase, and we'll fix it.", "購入後30日以内にメールでご連絡いただければ対応します。") },
];

export default function PackDetail({ pack }: { pack: Pack }) {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const legend = pack.accent === "gold";
  const linkedCreatures = pack.creatureSlugs.map((s) => findCreature(s)).filter(Boolean);
  const has3d = linkedCreatures.some((c) => c?.model3d);
  const relatedStory = linkedCreatures.length === 1 ? findStory(`the-day-${linkedCreatures[0]!.slug}-was-born`) : undefined;

  const buy = async () => {
    if (!pack.checkoutId) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: pack.checkoutId, mode: "payment" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Checkout failed.");
    } catch {
      setError("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell accent={pack.accent}>
      <div className="wrap" style={{ padding: "clamp(2.5rem,7vw,4.5rem) clamp(1rem,4vw,2.5rem) 5rem", maxWidth: 940 }}>
        <Link href="/#packs" className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "0.1em" }}>← {t({ en: "Packs", ja: "パック" })}</Link>

        {/* Hero */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)", gap: 28, marginTop: 20, marginBottom: "2.6rem" }} className="researcher-grid">
          <div>
            <div className={legend ? "holo-legend" : "holo"} style={{ position: "relative", aspectRatio: "1/1" }}>
              <Corners />
              {pack.slug === "creature-starter-pack" ? (
                <StarterPackVisual priority />
              ) : (
                <Image src={pack.image} alt={pack.name} fill sizes="(max-width: 900px) 90vw, 420px" priority style={{ objectFit: "contain" }} />
              )}
            </div>
          </div>
          <div>
            <h1 className={`font-display ${legend ? "chrome-gold" : "chrome"}`} style={{ fontSize: "clamp(1.7rem,4.2vw,2.4rem)", fontWeight: 800, marginBottom: 10 }}>{pack.name}</h1>
            <P style={{ fontSize: "1rem", marginBottom: 16 }}>{t(pack.forWho)}</P>
            <div className="font-display neon" style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 18 }}>
              {pack.priceUsd > 0 ? `$${pack.priceUsd.toFixed(2).replace(/\.00$/, "")}` : t({ en: "Not sold yet", ja: "まだ販売していません" })}
            </div>
            {pack.checkoutId ? (
              <button className="btn btn-solid" onClick={buy} disabled={loading} style={{ cursor: loading ? "wait" : "pointer" }}>
                {loading ? t({ en: "Redirecting…", ja: "リダイレクト中…" }) : `▸ ${t({ en: "Buy Now", ja: "今すぐ購入" })}`}
              </button>
            ) : (
              <span className="chip">{t({ en: "COMING WITH PHASE 4", ja: "Phase 4で提供予定" })}</span>
            )}
            {error && <p style={{ color: "var(--orange)", fontSize: "0.85rem", marginTop: 10 }}>{error}</p>}
          </div>
        </div>

        {/* SEE THE EVOLUTION */}
        {linkedCreatures.length > 0 && (
          <Reveal>
            <Section title={t({ en: "SEE THE EVOLUTION", ja: "進化を見る" })}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
                {linkedCreatures.map((c) => c && (
                  <Link key={c.slug} href={`/creatures/${c.slug}`} className="holo" style={{ display: "block", padding: "0.9rem", textDecoration: "none" }}>
                    <Corners />
                    <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", marginBottom: 8 }}><Image src={c.image} alt={c.name} fill style={{ objectFit: "contain" }} /></div>
                    <div className="font-display" style={{ fontSize: "0.85rem", color: "var(--text)", textAlign: "center" }}>{c.name}</div>
                  </Link>
                ))}
              </div>
            </Section>
          </Reveal>
        )}

        {/* WHAT'S INSIDE */}
        <Reveal>
          <Section title={t({ en: "WHAT'S INSIDE", ja: "内容" })}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
              {pack.includes.map((inc, i) => <li key={i} style={{ color: "var(--text)", fontSize: "0.94rem" }}>├─ {t(inc)}</li>)}
            </ul>
          </Section>
        </Reveal>

        {/* FORMATS */}
        <Reveal>
          <Section title={t({ en: "FORMATS", ja: "対応フォーマット" })}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{pack.formats.map((f) => <span key={f} className="chip">{f}</span>)}</div>
          </Section>
        </Reveal>

        {/* SEE IT IN GAME — real 3D if available */}
        {has3d && (
          <Reveal>
            <Section title={t({ en: "SEE IT IN GAME", ja: "本当に動くところを見る" })}>
              <div className="holo ac-orange" style={{ aspectRatio: "16/9", position: "relative" }}>
                <Corners />
                <Creature3D src="/monsters/3d/monster.glb" />
              </div>
            </Section>
          </Reveal>
        )}

        {/* THE STORY */}
        {relatedStory && (
          <Reveal>
            <Section title={t({ en: "THE STORY", ja: "物語" })}>
              <Link href={`/stories/${relatedStory.slug}`} className="holo" style={{ display: "block", padding: "1.2rem 1.4rem", textDecoration: "none" }}>
                <Corners />
                <div className="font-display" style={{ color: "var(--text)", fontWeight: 700, marginBottom: 6 }}>{t(relatedStory.title)}</div>
                <P style={{ fontSize: "0.88rem" }}>{t(relatedStory.summary)}</P>
              </Link>
            </Section>
          </Reveal>
        )}

        {/* SYNCHRO'S NOTE */}
        {pack.synchroNote && (
          <Reveal>
            <Section title="SYNCHRO'S NOTE">
              <div className="holo ac-magenta" style={{ padding: "1.4rem 1.6rem" }}>
                <Corners />
                <p className="font-display" style={{ whiteSpace: "pre-line", color: "var(--magenta)", fontSize: "1rem", fontWeight: 500, margin: 0 }}>{t(pack.synchroNote)}</p>
              </div>
            </Section>
          </Reveal>
        )}

        {/* LICENSE */}
        <Reveal>
          <Section title={t({ en: "LICENSE", ja: "ライセンス" })}>
            <div className="holo" style={{ padding: "1.2rem 1.4rem" }}><Corners /><P style={{ margin: 0 }}>{t(pack.license)}</P></div>
          </Section>
        </Reveal>

        {/* FAQ */}
        <Reveal>
          <Section title="FAQ">
            <div style={{ display: "grid", gap: 10 }}>
              {faq.map((f, i) => (
                <details key={i} className="holo" style={{ padding: "1rem 1.2rem" }}>
                  <summary className="font-display" style={{ cursor: "pointer", fontWeight: 700, color: "var(--text)", listStyle: "none" }}><span className="neon" style={{ marginRight: 8 }}>?</span>{t(f.q)}</summary>
                  <p style={{ color: "var(--text-dim)", marginTop: 10, fontSize: "0.9rem" }}>{t(f.a)}</p>
                </details>
              ))}
            </div>
          </Section>
        </Reveal>

        {/* BUY (bottom) */}
        {pack.checkoutId && (
          <Reveal>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button className="btn btn-solid" onClick={buy} disabled={loading} style={{ cursor: loading ? "wait" : "pointer" }}>
                {loading ? t({ en: "Redirecting…", ja: "リダイレクト中…" }) : `▸ ${t({ en: "Buy Now", ja: "今すぐ購入" })} · $${pack.priceUsd.toFixed(2).replace(/\.00$/, "")}`}
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "2.2rem" }}>
      <div className="kicker" style={{ marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}
