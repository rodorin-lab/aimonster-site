"use client";

import { Component, useEffect, useState, type ReactNode, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { creatures } from "@/lib/creatures";
import { packs } from "@/lib/packs";
import { useLang } from "@/lib/i18n";
import s from "./world.module.css";

const Viewer = dynamic(() => import("@/components/Creature3D"), { ssr: false, loading: () => <p className={s.loading}>Opening the observation chamber…</p> });
const Arena = dynamic(() => import("./ResonanceArena"), { ssr: false, loading: () => <p className={s.loading}>Building the resonance field…</p> });
const SAVE_KEY = "mf2-field-notes-v1";
const sellable = packs.filter(p => p.checkoutId);
const accents: Record<string, string> = { FIRE: "#ff8a2a", ICE: "#00fff0", ELECTRIC: "#00fff0", DARK: "#ff2ee0", LAVA: "#ff8a2a", HOLY: "#ffd700" };

export default function FactoryWorld() {
  const { lang, toggle } = useLang();
  const ja = lang === "ja";
  const text = (jp: string, en: string) => ja ? jp : en;
  const [active, setActive] = useState(0);
  const [view3d, setView3d] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("curated");
  const [saved, setSaved] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [game, setGame] = useState(false);
  const c = creatures[active];

  useEffect(() => {
    let initial: string[] = [];
    try {
      const value: unknown = JSON.parse(localStorage.getItem(SAVE_KEY) || "[]");
      if (Array.isArray(value)) initial = value.filter((v): v is string => typeof v === "string" && creatures.some(c => c.slug === v));
    } catch { /* Corrupt or blocked storage must not break the shop. */ }
    const timer = setTimeout(() => { setSaved(initial); setStorageReady(true); }, 0);
    return () => clearTimeout(timer);
  }, []);

  function save(slug: string) {
    const next = saved.includes(slug) ? saved.filter(v => v !== slug) : [...saved, slug];
    setSaved(next);
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(next)); setStorageError(false); }
    catch { setStorageError(true); }
  }

  const products = sellable.filter(p => {
    const related = creatures.filter(c => p.creatureSlugs.includes(c.slug));
    const haystack = [p.name, p.forWho[lang], ...related.map(c => `${c.alias[lang]} ${c.element} ${c.role}`)].join(" ").toLowerCase();
    return haystack.includes(query.toLowerCase().trim()) &&
      (filter === "all" || filter === "3d" && p.formats.includes("GLB") || filter === "starter" && p.group === "start-here" || filter === "saved" && p.creatureSlugs.some(slug => saved.includes(slug)));
  }).sort((a, b) => sort === "low" ? a.priceUsd - b.priceUsd : sort === "high" ? b.priceUsd - a.priceUsd : 0);

  return <div className={s.world}>
    <a className={s.skip} href="#market">{text("マーケットへ移動", "Skip to marketplace")}</a>
    <div className={s.preview}><span>AILIS EDITION / 2.0</span><span>{text("別ブランチの実験版 · 既存の商品・決済を継承", "Branch preview · original products & checkout preserved")}</span><Link href="/classic">CLASSIC ↗</Link></div>
    <header className={s.nav}>
      <Link href="/" className={s.brand}><span className={s.brandMark}>M<span>✳</span></span><span>MONSTER<br /><b>FACTORY</b><small>CREATURE CULTURE / EST. 2026</small></span></Link>
      <nav aria-label={text("メインナビゲーション", "Main navigation")}><a href="#observatory">{text("観察室", "Observatory")}</a><a href="#market">{text("マーケット", "Marketplace")}</a><a href="#playground">{text("実験場", "Playground")}</a><a href="#fieldnotes">{text("標本帳", "Field notes")} <span>{String(saved.length).padStart(2, "0")}</span></a></nav>
      <button onClick={toggle} className={s.lang} aria-label={text("英語に切り替え", "Switch to Japanese")}>{ja ? "EN / 日本語" : "EN / JP"} ↗</button>
    </header>
    <main>
      <section className={s.hero} id="observatory">
        <div className={s.heroCopy}>
          <p className={s.eyebrow}><span className={s.dot} /> THE LIVING ARCHIVE — VOL. 001</p>
          <h1>{text("世界は、", "A world begins")}<br />{text("一体との", "with a single")}<br /><em>{text("出会いから。", "encounter.")}</em></h1>
          <p className={s.intro}>{text("素材を探す。その少し先へ。物語を持つクリーチャーに出会い、観察し、あなたのゲームへ迎え入れる。ここは、まだ見ぬ世界の出発点。", "Go beyond finding assets. Meet creatures with a story. Observe their evolution. Bring them into your game. This is where your next world begins.")}</p>
          <div className={s.actions}><a className={s.primary} href="#market">{text("クリーチャーを迎える", "Find your creature")} <span>↗</span></a><a className={s.textLink} href="#playground">{text("実験場で遊ぶ", "Enter the playground")} <span>↓</span></a></div>
          <div className={s.heroFacts}><span><b>06</b>{text("物語のある生命", "CREATURE STORIES")}</span><span><b>01</b>{text("本物の3D試作", "REAL 3D PROTOTYPE")}</span><span><b>∞</b>{text("あなたが作る世界", "WORLDS TO BUILD")}</span></div>
        </div>
        <div className={s.observation} style={{ "--specimen": accents[c.element] } as CSSProperties}>
          <div className={s.observationTop}><span>OBSERVATION CHAMBER</span><span>SPECIMEN / {String(active + 1).padStart(3, "0")}</span></div>
          <div className={s.specimenStage}>
            <div className={s.orbit} /><div className={s.orbitSmall} /><span className={s.coordinate}>35° N<br />139° E<br />MF — 02</span>
            {view3d && c.model3d ? <div className={s.viewer}><Viewer key={c.slug} src={c.model3d} /></div> : <Image key={c.slug} src={c.image} alt={c.alias[lang]} fill priority sizes="(max-width: 800px) 95vw, 50vw" className={s.specimenImage} />}
            <span className={s.stageLabel}>{view3d ? "3D PROTOTYPE / DRAG TO ROTATE" : "ORIGINAL PIXEL SPECIMEN"}</span>
            {c.model3d && <button className={s.viewToggle} onClick={() => setView3d(v => !v)} aria-pressed={view3d}>{view3d ? "↶ PIXEL" : "↗ EXPLORE IN 3D"}</button>}
          </div>
          <div className={s.specimenInfo}><div><span className={s.eyebrow}>{c.element} / {c.role}</span><h2>{c.alias[lang]}</h2><p>{c.personality[lang]}</p></div><button className={s.saveSpecimen} disabled={!storageReady} onClick={() => save(c.slug)} aria-pressed={saved.includes(c.slug)} aria-label={text("このクリーチャーを標本帳に保存", "Save this creature to field notes")}>{saved.includes(c.slug) ? "♥" : "♡"}</button></div>
          <div className={s.specimenStrip}>{creatures.map((item, i) => <button key={item.slug} onClick={() => { setActive(i); setView3d(false); }} aria-pressed={active === i} aria-label={item.alias[lang]}><Image src={item.image} alt="" width={52} height={52} /><span>{String(i + 1).padStart(2, "0")}</span></button>)}</div>
        </div>
      </section>
      <div className={s.manifesto}><span>NOT JUST ASSETS.</span><p>{text("次の世界の、住人たち。", "The inhabitants of your next world.")}</p><span>MEET. OBSERVE. CREATE.</span></div>

      <section className={s.market} id="market">
        <div className={s.sectionHead}><div><p className={s.eyebrow}>01 / THE MARKETPLACE</p><h2>{text("あなたの世界に、", "Make room for")}<br /><em>{text("空席はある？", "something extraordinary.")}</em></h2></div><p>{text("既存の全7商品をそのままに。価格も、中身も、商用利用条件も、購入前に確認できます。", "All seven existing products, unchanged. Explore prices, contents and commercial-use terms before you buy.")}</p></div>
        <div className={s.tools}><label className={s.search}><span>⌕</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={text("名前・属性・役割で探す…", "Search names, elements, roles…")} aria-label={text("商品を検索", "Search products")} /></label><label className={s.sort}>{text("並び順", "Sort")}<select value={sort} onChange={e => setSort(e.target.value)}><option value="curated">{text("おすすめ順", "Curated")}</option><option value="low">{text("価格が低い順", "Price: low to high")}</option><option value="high">{text("価格が高い順", "Price: high to low")}</option></select></label></div>
        <div className={s.filters}>{[["all", text("すべて", "All specimens")], ["starter", "Starter"], ["3d", text("3D試作付き", "With 3D prototype")], ["saved", text("標本帳から", "From field notes")]].map(([id, label]) => <button key={id} onClick={() => setFilter(id)} aria-pressed={filter === id}>{label}</button>)}<span aria-live="polite">{products.length} / {sellable.length} PACKS</span></div>
        <div className={s.products}>{products.map((p, i) => <article key={p.slug} className={s.product}>
          <Link href={`/packs/${p.slug}`} className={s.productImage}><span className={s.productNumber}>{String(i + 1).padStart(2, "0")} / COLLECTION</span><Image src={p.image} alt={p.name} fill sizes="(max-width: 650px) 90vw, (max-width: 1000px) 45vw, 30vw" /><span className={s.productBadge}>{p.formats.includes("GLB") ? "PIXEL + 3D PROTOTYPE" : p.group === "start-here" ? "3 CREATURES / START HERE" : "PIXEL COLLECTION"}</span></Link>
          <div className={s.productBody}><div className={s.productTitle}><h3><Link href={`/packs/${p.slug}`}>{p.name}</Link></h3><span>${p.priceUsd.toFixed(2)}</span></div><p>{p.forWho[lang]}</p><div className={s.formats}>{p.formats.map(f => <span key={f}>{f}</span>)}<span>{text("商用利用込み", "Commercial use")}</span></div><div className={s.productActions}><Link href={`/packs/${p.slug}`}>{text("内容とライセンスを見る", "View pack & license")} ↗</Link><button onClick={() => setCompare(old => old.includes(p.slug) ? old.filter(v => v !== p.slug) : old.length < 3 ? [...old, p.slug] : old)} disabled={compare.length === 3 && !compare.includes(p.slug)} aria-pressed={compare.includes(p.slug)} aria-label={`${p.name} ${text("を比較", "compare")}`}>{compare.includes(p.slug) ? "✓" : "+"} {text("比較", "Compare")}</button></div></div>
        </article>)}</div>
        {!products.length && <div className={s.empty}><h3>{text("まだ出会えていないだけ。", "A different search, a new encounter.")}</h3><p>{text("検索語やフィルターを変えてみてね。", "Try another search or filter.")}</p><button className={s.primary} onClick={() => { setQuery(""); setFilter("all"); }}>{text("すべて表示", "Show all packs")}</button></div>}
        {compare.length > 0 && <div className={s.comparison}><div className={s.compareHead}><h3>{text("持ち帰る世界を、比べてみる。", "Compare your next worlds.")}</h3><button onClick={() => setCompare([])}>{text("比較をクリア", "Clear comparison")} ×</button></div><p>{text("最大3商品。決済は各商品ページから。", "Up to three packs. Checkout remains on each product page.")}</p><div className={s.tableScroll}><table><caption>{text("選択した商品の価格と形式", "Selected product prices and formats")}</caption><thead><tr><th>{text("商品", "Pack")}</th><th>USD</th><th>{text("形式", "Formats")}</th><th>{text("内容", "Details")}</th></tr></thead><tbody>{compare.map(slug => { const p = sellable.find(p => p.slug === slug)!; return <tr key={slug}><th scope="row">{p.name}</th><td>${p.priceUsd.toFixed(2)}</td><td>{p.formats.join(" / ")}</td><td><Link href={`/packs/${slug}`}>{text("商品ページ", "View pack")} ↗</Link></td></tr>; })}</tbody></table></div></div>}
      </section>

      <section className={s.playground} id="playground"><div className={s.sectionHead}><div><p className={s.eyebrow}>02 / RESONANCE FIELD</p><h2>{text("見るだけじゃ、", "Some worlds")}<br /><em>{text("もったいない。", "need to be played.")}</em></h2></div><p>{text("45秒の小さな3D実験。共鳴体を動かし、赤いパルスを避けて6つの結晶を集めよう。購入不要・音声なし。", "A 45-second 3D experiment. Guide a resonance creature, avoid red pulses and gather six crystals. No purchase. No audio.")}</p></div>
        <div className={s.arena}>{game ? <GameBoundary fallback={<div className={s.empty}><h3>{text("3D実験場を起動できませんでした。", "The 3D playground is unavailable.")}</h3><p>{text("WebGL対応ブラウザーで試してね。商品ページはそのまま使えます。", "Try a WebGL-capable browser. Product pages still work normally.")}</p></div>}><Arena ja={ja} /></GameBoundary> : <div className={s.gameInvitation}><div className={s.islandArt}><span>✧</span><i /><b>◈</b><span>✧</span></div><p className={s.eyebrow}>INTERACTIVE 3D / EXPERIMENT 001</p><h3>THE RESONANCE FIELD</h3><p>{text("あなたの操作で、世界が動き出す。", "A little world, waiting for your first move.")}</p><button className={s.playButton} onClick={() => setGame(true)}>▷ {text("実験を始める", "Begin experiment")}</button><small>{text("必要なときだけ3Dを読み込みます。", "3D loads only when you enter.")}</small></div>}</div>
        <p className={s.disclaimer}>{text("実験場の共鳴体は、この体験用のプロシージャル3Dキャラクターです。販売パックの内容物・アニメーション・ゲーム用リグを示すものではありません。", "The resonance creature is a procedural 3D character made for this experiment, not a representation of a pack’s contents, animations or game-ready rig.")}</p>
      </section>

      <section className={s.fieldnotes} id="fieldnotes"><div className={s.sectionHead}><div><p className={s.eyebrow}>03 / YOUR FIELD NOTES</p><h2>{text("心に残った、", "Keep the ones")}<br /><em>{text("あの一体。", "that stay with you.")}</em></h2></div><p>{text("観察室のハートで保存。アカウント不要、このブラウザーだけの小さな標本帳です。購入履歴や所有権を示すものではありません。", "Save with the heart in the observatory. No account: just a private field notebook in this browser. These are bookmarks, not purchases or ownership.")}</p></div>
        <div aria-live="polite">{storageError && <p role="status">{text("このブラウザーでは保存できませんでした。今の画面内でのみ保持します。", "Browser storage is unavailable. Notes will last only for this visit.")}</p>}</div>
        {saved.length ? <div className={s.notesGrid}>{creatures.filter(c => saved.includes(c.slug)).map(c => <article key={c.slug}><Image src={c.image} alt={c.alias[lang]} width={100} height={100} /><div><span>{c.element}</span><h3>{c.alias[lang]}</h3><Link href={`/creatures/${c.slug}`}>{text("物語を読む", "Read their story")} ↗</Link></div><button onClick={() => save(c.slug)} aria-label={`${c.alias[lang]} ${text("を標本帳から外す", "remove from field notes")}`}>×</button></article>)}</div> : <div className={s.notesEmpty}><span>♡</span><p>{text("最初の出会いを、ここに。", "Your first encounter belongs here.")}</p><a href="#observatory">{text("観察室へ戻る", "Back to the observatory")} ↑</a></div>}
      </section>
      <section className={s.closing}><p className={s.eyebrow}>A SMALL CREATURE. A BIG BEGINNING.</p><h2>{text("まだない世界を、", "Make a world")}<br /><em>{text("一緒につくろう。", "that isn’t here. Yet.")}</em></h2><Link className={s.primary} href="/packs/creature-starter-pack">{text("最初の3体に出会う", "Meet your first three")} — $9.90 ↗</Link></section>
    </main>
    <footer className={s.footer}><div><b>MONSTER FACTORY / 2.0</b><p>THE LIVING ARCHIVE · An experiment by AILIS for Rodorin.</p></div><div><Link href="/stories">STORIES ↗</Link><Link href="/roadmap">ROADMAP ↗</Link><Link href="/classic">CLASSIC ↗</Link><a href="https://github.com/rodorin-lab" target="_blank" rel="noopener noreferrer">GITHUB ↗</a></div><small>{text("既存の商品ページ・価格・Stripe決済を継承。3Dは一部試作。", "Original product pages, prices and Stripe checkout preserved. 3D is partially prototyped.")}</small></footer>
  </div>;
}

class GameBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
