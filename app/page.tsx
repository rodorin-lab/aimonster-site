"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useLang, bi } from "@/lib/i18n";
import {
  brand, nav, hero, metamorphLab, evolution, fromPackToGame, ranch, finalCta, footer, LINKS,
} from "@/lib/content";
import { creatures, filterGroups, matchesFilter } from "@/lib/creatures";
import { bestSellers, legendaryPacks, startHerePack, completeCollection } from "@/lib/packs";
import { stories, roadmap, nextPackIdeas, ranchLog } from "@/lib/collections";
import Background from "@/components/Background";
import Boot from "@/components/Boot";
import Nav from "@/components/Nav";
import { Reveal } from "@/components/motion";
import { Corners, Head, P, dOf, acClass, CreatureCard, PackCard } from "@/components/shared";
import EvolutionSlider from "@/components/EvolutionSlider";
import StarterPackVisual from "@/components/StarterPackVisual";

const Creature3D = dynamic(() => import("@/components/Creature3D"), { ssr: false });

export default function Page() {
  const { t } = useLang();
  const [filter, setFilter] = useState<"all" | "dragon" | "slime" | "boss" | "legendary">("all");
  const shown = creatures.filter((c) => matchesFilter(c, filter));
  const starter = startHerePack();
  const sellers = bestSellers();
  const legend = legendaryPacks();
  const complete = completeCollection();

  return (
    <>
      <Background />
      <div className="fx-overlay" />
      <div className="scan-sweep" />
      <Boot />
      <Nav />

      <main>
        {/* ═══ 00 / HERO ═══ */}
        <section id="hero" className="ac-cyan" style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div className="grid-floor" />
          <div className="wrap hero-grid" style={{ position: "relative", zIndex: 3, paddingTop: 96, paddingBottom: 60 }}>
            <div className="hero-copy">
              <div className="font-mono" style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", fontSize: "0.72rem", color: "var(--text-faint)", letterSpacing: "0.14em", marginBottom: "1rem" }}>
                {hero.systemBar.map((s, i) => <span key={i}><span style={{ color: i === 1 ? "var(--magenta)" : "var(--cyan)" }}>{"//"}</span> {s}</span>)}
              </div>

              <div className="hero-eyebrow">◆ {t(hero.eyebrow)}</div>

              <div className="font-mono hero-evo-strip">
                {hero.evoStrip.map((s, i) => (
                  <span key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className={i === 0 ? "neon" : ""} style={{ color: i === 0 ? "var(--cyan)" : "var(--text-faint)" }}>{s}</span>
                    {i < hero.evoStrip.length - 1 && <span style={{ color: "var(--text-faint)" }}>→</span>}
                  </span>
                ))}
              </div>

              <h1 className="hero-title">
                <span className="chrome">{t(hero.headline)}</span>
              </h1>

              <P style={{ marginTop: "1.25rem", color: "var(--text)", fontSize: "1.04rem", maxWidth: 650 }}>{t(hero.body)}</P>

              <div className="hero-actions">
                {hero.ctas.map((c, i) => c.kind === "route" ? (
                  <Link key={i} className={`btn ${c.solid ? "btn-solid" : ""} ${acClass(c.accent)}`} href={c.to}>
                    {c.solid ? "▸ " : ""}{t(c.label)}
                  </Link>
                ) : (
                  <a key={i} className={`btn ${c.solid ? "btn-solid" : ""} ${acClass(c.accent)}`} href={`#${c.to}`} onClick={(e) => { e.preventDefault(); document.getElementById(c.to)?.scrollIntoView({ behavior: "smooth" }); }}>
                    {c.solid ? "▸ " : ""}{t(c.label)}
                  </a>
                ))}
              </div>

              <div className="hero-proof">
                {hero.proof.map((p, i) => <span key={i} className="chip">◉ {t(p)}</span>)}
              </div>
            </div>

            <Link href="/packs/creature-starter-pack" className="hero-product ac-green" aria-label={t({ en: "View the Creature Starter Pack", ja: "Creature Starter Packを見る" })}>
              <div className="hero-product__label">◆ START HERE / REAL PACK</div>
              <StarterPackVisual priority />
              <div className="hero-product__footer">
                <span>{t({ en: "3 CREATURES · COMMERCIAL USE", ja: "3体入り · 商用利用OK" })}</span>
                <strong>{t({ en: "VIEW PACK →", ja: "中身を見る →" })}</strong>
              </div>
            </Link>
          </div>
        </section>

        {/* ═══ 01 / THE METAMORPH LAB ═══ */}
        <section id="lab" className="section ac-cyan">
          <div className="wrap">
            <Head eyebrow={metamorphLab.eyebrow} title={metamorphLab.heading} lead={metamorphLab.lead} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 14, marginBottom: "2.4rem" }}>
              {metamorphLab.principles.map((p, i) => (
                <Reveal key={i} delay={dOf(i)}>
                  <div className="holo" style={{ padding: "1.3rem", textAlign: "center", height: "100%" }}>
                    <Corners />
                    <div className="font-mono neon" style={{ fontSize: "0.78rem", letterSpacing: "0.16em", marginBottom: 8 }}>{p.k}</div>
                    <div style={{ color: "var(--text)", fontSize: "0.95rem" }}>{t(p.v)}</div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="holo ac-magenta" style={{ padding: "1.8rem 2rem", textAlign: "center" }}>
                <Corners />
                <p className="font-display neon" style={{ whiteSpace: "pre-line", fontSize: "clamp(1.2rem,3vw,1.7rem)", fontWeight: 700, margin: 0 }}>{t(metamorphLab.manifesto)}</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ 02 / EVOLUTION ═══ */}
        <section id="evolution" className="section ac-cyan" style={{ background: "linear-gradient(180deg, transparent, rgba(0,255,240,0.04), transparent)" }}>
          <div className="wrap">
            <Head eyebrow={evolution.eyebrow} title={evolution.heading} lead={evolution.lead} />
            <Reveal><div style={{ marginBottom: "2.4rem" }}><EvolutionSlider /></div></Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 14, marginBottom: "1.6rem" }}>
              {evolution.stages.map((s, i) => (
                <Reveal key={s.id} delay={dOf(i)}>
                  <div className="holo" style={{ padding: "1.3rem", height: "100%" }}>
                    <Corners />
                    <div className="font-display neon" style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.1em", marginBottom: 6 }}>{s.label}</div>
                    <div className="chip" style={{ marginBottom: 10 }}>{t(s.state)}</div>
                    <P style={{ fontSize: "0.88rem" }}>{t(s.body)}</P>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal><div className="holo" style={{ padding: "1.2rem 1.4rem", borderLeft: "3px solid var(--ac)" }}><P style={{ margin: 0, fontSize: "0.92rem" }}>{t(evolution.note)}</P></div></Reveal>
          </div>
        </section>

        {/* ═══ 03 / LORE CODEX ═══ */}
        <section id="codex" className="section ac-magenta">
          <div className="wrap">
            <Head eyebrow="03 / LORE CODEX" title={bi("Creatures worth remembering.", "推せるクリーチャーたち")} lead={bi(
              "What you'll find here isn't just an image file.\n\nA name. A personality. A habitat. A role. A small story.\n\nCreatures worth remembering before you ever use them in a game.",
              "ここで出会えるのは、画像ファイルだけじゃない。\n\n名前。性格。生息地。役割。小さな物語。\n\nゲームに使う前から、覚えていたくなるクリーチャーたちです。",
            )} />
            <Reveal>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
                {filterGroups.map((f) => {
                  const on = filter === f.id;
                  return (
                    <button key={f.id} onClick={() => setFilter(f.id)} className="font-mono" style={{ cursor: "pointer", padding: "6px 14px", fontSize: 12, letterSpacing: "0.1em", borderRadius: 2, border: `1px solid rgba(255,46,224,${on ? 0.65 : 0.25})`, background: on ? "rgba(255,46,224,0.14)" : "transparent", color: on ? "var(--magenta)" : "var(--text-dim)" }}>{t(f.label)}</button>
                  );
                })}
              </div>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 16 }}>
              {shown.map((c, i) => <CreatureCard key={c.slug} creature={c} delay={dOf(i)} />)}
            </div>
          </div>
        </section>

        {/* ═══ 04 / FROM PACK TO GAME ═══ */}
        <section className="section ac-orange">
          <div className="wrap">
            <Head eyebrow={fromPackToGame.eyebrow} title={fromPackToGame.heading} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 14, marginBottom: "2.2rem" }}>
              {fromPackToGame.steps.map((s, i) => (
                <Reveal key={s.n} delay={dOf(i)}>
                  <div className="holo" style={{ padding: "1.3rem", height: "100%" }}>
                    <Corners />
                    <div className="font-mono neon" style={{ fontSize: "0.8rem", letterSpacing: "0.12em", marginBottom: 6 }}>{s.n} · {s.k}</div>
                    <div style={{ color: "var(--text)", fontSize: "0.94rem" }}>{t(s.v)}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="holo" style={{ padding: "1.6rem", marginBottom: "1.6rem" }}>
                <Corners />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
                  <div>
                    <div className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-faint)", letterSpacing: "0.1em", marginBottom: 8 }}>{t(fromPackToGame.compat.formatsLabel)}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{fromPackToGame.compat.formats.map((f) => <span key={f} className="chip">{f}</span>)}</div>
                  </div>
                  <div>
                    <div className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-faint)", letterSpacing: "0.1em", marginBottom: 8 }}>{t(fromPackToGame.compat.enginesLabel)}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{fromPackToGame.compat.engines.map((e) => <span key={e} className="chip">{e}</span>)}</div>
                  </div>
                </div>
                <p className="font-mono" style={{ fontSize: "0.74rem", color: "var(--text-faint)", marginTop: 14, marginBottom: 0 }}>{t(fromPackToGame.compat.note)}</p>
              </div>
            </Reveal>

            {/* proof showcase — the real 3D prototype, interactive */}
            <Reveal>
              <div className="kicker" style={{ marginBottom: 10 }}>{t(fromPackToGame.proof.heading)}</div>
              <P style={{ marginBottom: 16 }}>{t(fromPackToGame.proof.lead)}</P>
              <div className="holo ac-orange anim-border" style={{ aspectRatio: "16/9", position: "relative" }}>
                <Corners />
                <Creature3D src="/monsters/3d/monster.glb" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ 05 / PACKS ═══ */}
        <section id="packs" className="section ac-orange" style={{ background: "linear-gradient(180deg, transparent, rgba(255,138,42,0.05), transparent)" }}>
          <div className="wrap">
            <Head eyebrow="05 / PACKS" title={bi("Bring a creature into your world.", "クリーチャーを、自分の世界へ連れていく。")} />

            {/* START HERE */}
            <div className="kicker ac-green" style={{ marginBottom: 12 }}>START HERE</div>
            <Reveal>
              <div className="holo ac-green anim-border" style={{ padding: "1.8rem", marginBottom: "2.4rem", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.3fr)", gap: 20 }}>
                <Corners />
                <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: 4, overflow: "hidden", background: "rgba(0,0,0,0.3)" }}>
                  <StarterPackVisual />
                </div>
                <div>
                  <h3 className="font-display neon" style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>{starter.name}</h3>
                  <div className="font-display" style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--green)", marginBottom: 10 }}>${starter.priceUsd}</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 14px", display: "grid", gap: 6 }}>
                    {starter.includes.map((inc, i) => <li key={i} style={{ color: "var(--text)", fontSize: "0.9rem" }}>├─ {t(inc)}</li>)}
                  </ul>
                  {starter.synchroNote && <SynchroNoteInline text={starter.synchroNote} />}
                  <div style={{ marginTop: 14 }}><Link className="btn btn-solid ac-green" href={`/packs/${starter.slug}`}>▸ {t({ en: "View pack", ja: "パックを見る" })}</Link></div>
                </div>
              </div>
            </Reveal>

            {/* BEST SELLERS */}
            <div className="kicker" style={{ marginBottom: 12 }}>BEST SELLERS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 16, marginBottom: "2.4rem" }}>
              {sellers.map((p, i) => <PackCard key={p.slug} pack={p} delay={dOf(i)} />)}
            </div>

            {/* LEGENDARY */}
            <div className="kicker ac-gold" style={{ marginBottom: 12, color: "var(--gold)" }}>LEGENDARY</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 16, marginBottom: "2.4rem", maxWidth: 360 }}>
              {legend.map((p, i) => <PackCard key={p.slug} pack={p} delay={dOf(i)} />)}
            </div>

            {/* COMPLETE COLLECTION — future, not purchasable */}
            <div className="kicker" style={{ marginBottom: 12 }}>COMPLETE COLLECTION</div>
            <Reveal>
              <div className="holo" style={{ padding: "1.6rem", opacity: 0.75 }}>
                <Corners />
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <h3 className="font-display" style={{ fontSize: "1.1rem", fontWeight: 700 }}>{complete.name}</h3>
                  <span className="chip">{t({ en: "NOT YET AVAILABLE", ja: "近日公開" })} · $79–99</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
                  {complete.includes.map((inc, i) => <li key={i} style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>— {t(inc)}</li>)}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ 06 / STORIES + ROADMAP ═══ */}
        <section id="stories" className="section ac-magenta">
          <div className="wrap">
            <Head eyebrow="06 / STORIES" title={bi("What happened inside the lab.", "研究所の中で、何が起きたか。")} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 16 }}>
              {stories.map((s, i) => (
                <Reveal key={s.slug} delay={dOf(i)} className={acClass(s.accent)}>
                  <Link href={`/stories/${s.slug}`} className="holo" style={{ display: "block", padding: "1.4rem", height: "100%", textDecoration: "none" }}>
                    <Corners />
                    <div className="font-mono" style={{ fontSize: "0.66rem", letterSpacing: "0.1em", color: "rgba(var(--ac-rgb),0.9)", marginBottom: 8 }}>{s.date} · {s.readTime}</div>
                    <h3 className="font-display" style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{t(s.title)}</h3>
                    <P style={{ fontSize: "0.88rem" }}>{t(s.summary)}</P>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="roadmap" className="section ac-cyan" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="kicker" style={{ marginBottom: 12 }}>06 / ROADMAP</div>
            <Reveal delay={1}><h2 className="section-title chrome" style={{ margin: "0.4rem 0 1.8rem" }}>{t(bi("What's coming next.", "次に生まれるもの。"))}</h2></Reveal>
            <div style={{ display: "grid", gap: 10, marginBottom: "2.2rem" }}>
              {roadmap.map((r, i) => (
                <Reveal key={i} delay={dOf(i)}>
                  <div className="holo" style={{ padding: "1.1rem 1.4rem", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                    <Corners />
                    <span className="chip" style={{ minWidth: 64, justifyContent: "center" }}>{r.state}</span>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div className="font-display" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>{r.title}</div>
                      <P style={{ fontSize: "0.86rem" }}>{t(r.body)}</P>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="kicker" style={{ marginBottom: 10 }}>{t(bi("Pack ideas we're considering", "検討中のパック案"))}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
                {nextPackIdeas.map((p, i) => (
                  <div key={i} className="holo" style={{ padding: "1.1rem 1.3rem" }}>
                    <Corners />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span className="font-display" style={{ fontWeight: 700, fontSize: "0.92rem" }}>{p.name}</span>
                      <span className="font-mono" style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>{p.priceHint}</span>
                    </div>
                    <P style={{ fontSize: "0.84rem", marginTop: 6 }}>{t(p.body)}</P>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ 07 / THE RANCH ═══ */}
        <section id="ranch" className="section ac-green" style={{ background: "linear-gradient(180deg, transparent, rgba(0,255,90,0.04), transparent)" }}>
          <div className="wrap">
            <Head eyebrow={ranch.eyebrow} title={ranch.heading} lead={ranch.lead} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginBottom: "2rem" }}>
              {ranch.phase1.map((p, i) => (
                <Reveal key={i} delay={dOf(i)} className="ac-green">
                  <a href={p.href} target={p.external ? "_blank" : undefined} rel={p.external ? "noopener noreferrer" : undefined} className="holo ranch-link" style={{ padding: "1.1rem 1.3rem", textAlign: "center" }}>
                    <Corners />
                    <span style={{ color: "var(--text)", fontSize: "0.92rem" }}>{t(p.label)}</span>
                    <span aria-hidden="true" style={{ color: "var(--green)" }}>↗</span>
                  </a>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="holo" style={{ padding: "1.4rem 1.6rem", opacity: 0.8 }}>
                <Corners />
                <div className="kicker" style={{ marginBottom: 10 }}>{t(ranch.future.label)}</div>
                <P style={{ fontSize: "0.88rem", marginBottom: 6 }}>{t(ranch.future.phase2)}</P>
                <P style={{ fontSize: "0.88rem" }}>{t(ranch.future.phase3)}</P>
              </div>
            </Reveal>
            {/* Ranch Log — real weekly text-only log */}
            <Reveal>
              <div style={{ marginTop: "2.2rem" }}>
                <div className="kicker" style={{ marginBottom: 12 }}>{t(bi("Ranch Log", "牧場ログ"))}</div>
                {ranchLog.slice(0, 1).map((entry, i) => (
                  <div key={i} className="holo ac-green" style={{ padding: "1.3rem 1.5rem" }}>
                    <Corners />
                    <div className="font-mono neon" style={{ fontSize: "0.78rem", marginBottom: 10 }}>{entry.date}</div>
                    <RanchLogBlock label={t(bi("Done", "できた"))} items={entry.done} t={t} />
                    <RanchLogBlock label={t(bi("Broken", "壊れた"))} items={entry.broken} t={t} />
                    <RanchLogBlock label={t(bi("Next", "次"))} items={entry.next} t={t} />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ 08 / FINAL CTA ═══ */}
        <section className="section ac-magenta" style={{ textAlign: "center", borderTop: "1px solid rgba(0,255,240,0.1)" }}>
          <div className="wrap" style={{ maxWidth: 780 }}>
            <Reveal><h2 className="section-title chrome" style={{ margin: "0 0 1rem" }}>{t(finalCta.heading)}</h2></Reveal>
            <Reveal delay={1}><P style={{ fontSize: "1.05rem", marginBottom: "2rem" }}>{t(finalCta.body)}</P></Reveal>
            <Reveal delay={2}>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: "2.4rem" }}>
                {finalCta.ctas.map((c, i) => {
                  const cls = i === 0 ? "btn btn-solid ac-magenta" : "btn";
                  const label = <>{i === 0 ? "▸ " : ""}{t(c.label)}</>;
                  return c.kind === "anchor" ? (
                    <a key={i} className={cls} href={`#${c.to}`} onClick={(e) => { e.preventDefault(); document.getElementById(c.to)?.scrollIntoView({ behavior: "smooth" }); }}>{label}</a>
                  ) : (
                    <Link key={i} className={cls} href={c.to}>{label}</Link>
                  );
                })}
              </div>
            </Reveal>
            <Reveal>
              <div className="holo" style={{ padding: "1.2rem 1.4rem", maxWidth: 520, marginInline: "auto" }}>
                <Corners />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px 24px" }}>
                  {finalCta.telemetry.map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "6px 0" }}>
                      <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-faint)" }}>{r.k}</span>
                      <span className="font-mono neon" style={{ fontSize: "0.72rem" }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="font-mono blink" style={{ marginTop: "2rem", fontSize: "0.74rem", letterSpacing: "0.2em", color: "var(--text-faint)" }}>
                {finalCta.end.map((e, i) => <div key={i} style={{ color: i === 1 ? "var(--cyan)" : undefined }}>{e}</div>)}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="ac-cyan" style={{ position: "relative", zIndex: 2, borderTop: "1px solid rgba(0,255,240,0.14)", padding: "2.6rem 0", textAlign: "center" }}>
          <div className="wrap">
            <div className="font-display" style={{ fontWeight: 800, letterSpacing: "0.1em", color: "var(--text)" }}>{brand.name} <span className="neon" style={{ color: "var(--cyan)" }}>⬡</span></div>
            <P style={{ fontSize: "0.86rem", marginTop: 8 }}>{t(footer.line)}</P>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
              {nav.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(n.id)?.scrollIntoView({ behavior: "smooth" }); }} className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-faint)", textDecoration: "none", letterSpacing: "0.08em" }}>{t(n.label)}</a>
              ))}
              <a href={LINKS.siteLab} target="_blank" rel="noopener noreferrer" className="font-mono" style={{ fontSize: "0.72rem", color: "var(--magenta)", textDecoration: "none", letterSpacing: "0.08em" }}>DIGITAL LIFEFORM LAB ↗</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function SynchroNoteInline({ text }: { text: import("@/lib/i18n").Bi }) {
  const { t } = useLang();
  return (
    <div className="ac-magenta" style={{ borderLeft: "2px solid var(--magenta)", paddingLeft: 10, marginTop: 4 }}>
      <div className="font-mono" style={{ fontSize: "0.66rem", color: "var(--magenta)", letterSpacing: "0.14em", marginBottom: 4 }}>◇ SYNCHRO</div>
      <p style={{ color: "var(--text)", fontSize: "0.86rem", margin: 0, whiteSpace: "pre-line" }}>{t(text)}</p>
    </div>
  );
}

function RanchLogBlock({ label, items, t }: { label: string; items: import("@/lib/i18n").Bi[]; t: (b: import("@/lib/i18n").Bi) => string }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="font-mono" style={{ fontSize: "0.7rem", color: "var(--text-faint)", letterSpacing: "0.1em", marginBottom: 4 }}>{label}:</div>
      {items.map((it, i) => <div key={i} style={{ color: "var(--text)", fontSize: "0.88rem" }}>- {t(it)}</div>)}
    </div>
  );
}
