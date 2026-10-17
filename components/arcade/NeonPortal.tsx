"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { creatures } from "@/lib/creatures";
import { arcadeGames } from "@/lib/arcade";
import s from "./neon.module.css";

export default function NeonPortal() {
  const [calm,setCalm] = useState(false);
  const [specimen,setSpecimen] = useState(0);
  const c = creatures[specimen];
  return <div className={`${s.shell} ${calm?s.calm:""}`}>
    <a className={s.skip} href="#worlds">コンテンツへ移動</a>
    <div className={s.stars} aria-hidden="true"/><div className={s.aurora} aria-hidden="true"/>
    <header className={s.nav}><Link href="/" className={s.brand}>M<span>✳</span>F <small>MONSTER FACTORY<br/>THE LIVING UNIVERSE</small></Link><nav aria-label="メインナビゲーション"><Link href="/arcade">ARCADE ↗</Link><Link href="/archive#market">MARKET</Link><Link href="/archive#observatory">CREATURES</Link></nav><button onClick={()=>setCalm(v=>!v)} aria-pressed={calm} className={s.fx}>{calm?"FX OFF":"FX ON"}</button></header>
    <main>
      <section className={s.hero}>
        <div className={s.heroCopy}><p className={s.kicker}><i/> INDEPENDENT CREATURE CULTURE / AILIS EDITION 2.1</p><h1>NOT JUST<br/>A GAME.<br/><span>A UNIVERSE.</span></h1><p className={s.japanese}>ぶっ飛んだ世界へ、<br/><strong>ようこそ。</strong></p><p className={s.lead}>遊べ。出会え。まだない世界をつくれ。<br/>AIと人が育てる、クリーチャーとゲームの宇宙。</p><div className={s.actions}><Link className={s.primary} href="/arcade">アーケードへ飛び込む <b>↗</b></Link><Link className={s.secondary} href="/archive#market">素材を探す →</Link></div><div className={s.coordinates}>SECTOR 001 — EARTH ORBIT <span>● SYSTEM ONLINE</span></div></div>
        <div className={s.reactor}>
          <div className={s.reactorRing} aria-hidden="true"/><div className={s.reactorRing2} aria-hidden="true"/>
          <span className={s.reactorLabel}>LIFEFORM SIGNAL / {String(specimen+1).padStart(3,"0")}</span>
          <div className={s.creatureImage}><Image src={c.image} alt={c.alias.ja} fill priority sizes="(max-width: 800px) 90vw, 45vw"/></div>
          <div className={s.reactorFloor} aria-hidden="true"/>
          <div className={s.specimenTag}><small>{c.element} / LIVING ARCHIVE</small><h2>{c.alias.ja}</h2><Link href={`/creatures/${c.slug}`}>この子の物語へ ↗</Link></div>
          <div className={s.creatureButtons} aria-label="クリーチャーを選ぶ">{creatures.map((v,i)=><button key={v.slug} aria-label={v.alias.ja} aria-pressed={specimen===i} onClick={()=>setSpecimen(i)}>{String(i+1).padStart(2,"0")}</button>)}</div>
          <span className={s.floatingBadge}>NO ORDINARY<br/><b>MONSTERS.</b> ✧</span>
        </div>
      </section>
      <div className={s.ticker} aria-hidden="true"><div>MEET THE UNEXPECTED ✳ PLAY THE IMPOSSIBLE ✳ BUILD YOUR UNIVERSE ✳ MEET THE UNEXPECTED ✳ PLAY THE IMPOSSIBLE ✳ BUILD YOUR UNIVERSE ✳</div></div>
      <section id="worlds" className={s.section}>
        <div className={s.sectionHeader}><div><p className={s.kicker}>01 / CHOOSE YOUR PORTAL</p><h2>ひとつの入口。<br/><span>いくつもの世界。</span></h2></div><p>眺めるだけで、終わらせない。<br/>気になる扉から、宇宙の奥へ。</p></div>
        <div className={s.portalGrid}>
          <Link href="/arcade" className={`${s.portalCard} ${s.arcadeCard}`}><span>01 / PLAY</span><div className={s.miniCabinets} aria-hidden="true"><i/><i/><i/></div><h3>THE LIVING<br/>ARCADE <b>↗</b></h3><p>AIたちの作品が集う、ネオンのゲームセンター。<br/>{arcadeGames.length}本のゲームを、今すぐプレイ。</p><small>{arcadeGames.length} GAMES / FREE TO PLAY</small></Link>
          <Link href="/archive#observatory" className={`${s.portalCard} ${s.labCard}`}><span>02 / DISCOVER</span><div className={s.labOrb} aria-hidden="true">✳</div><h3>CREATURE<br/>OBSERVATORY <b>↗</b></h3><p>6体の生命と、6つの物語。<br/>ホムラの3D試作も、ここで観察。</p><small>6 STORIES / 1 GLB PROTOTYPE</small></Link>
          <Link href="/archive#market" className={`${s.portalCard} ${s.marketCard}`}><span>03 / CREATE</span><div className={s.marketSymbol} aria-hidden="true">[ ✧ ]</div><h3>WORLD<br/>BUILDERS <b>↗</b></h3><p>出会ったクリーチャーを、あなたの作品へ。<br/>既存の商品・ライセンスをじっくり確認。</p><small>7 ORIGINAL PACKS / COMMERCIAL LICENSE</small></Link>
        </div>
      </section>
      <section className={s.section}>
        <div className={s.sectionHeader}><div><p className={s.kicker}>02 / NOW PLAYING IN THE ARCADE</p><h2>画面の向こうが、<br/><span>騒がしい。</span></h2></div><Link href="/arcade" className={s.secondary}>すべての筐体へ ↗</Link></div>
        <div className={s.gameGrid}>{arcadeGames.map((game,i)=><Link href={`/arcade?game=${game.id}`} key={game.id} className={s.gameCard} style={{"--accent":game.color} as React.CSSProperties}><div className={s.gameCover}>{game.cover?<Image src={game.cover} alt={`${game.title} 実ゲーム画面`} fill sizes="(max-width: 800px) 90vw, 33vw"/>:<div className={s.starArt} aria-label={game.title+"の装飾アート。ゲーム画面ではありません"}>✦<span>★</span>✧</div>}<span className={s.gameIndex}>0{i+1} / READY TO PLAY</span></div><div className={s.gameInfo}><small>{game.genre}</small><h3>{game.title} ↗</h3><p>{game.description}</p></div></Link>)}</div>
      </section>
      <section className={s.manifesto}><p className={s.kicker}>SMALL CREATURES. LIMITLESS POSSIBILITIES.</p><h2>完成しないから、<br/><em>面白い。</em></h2><p>新しいゲームが生まれるたび、筐体が増える。<br/>新しいモンスターが生まれるたび、世界が広がる。<br/>これは、私たちみんなで育てるファクトリー。</p><Link href="/arcade" className={s.primary}>次の世界へ、出発する ↗</Link></section>
    </main>
    <footer className={s.footer}><b>MONSTER FACTORY ✳ THE LIVING UNIVERSE</b><p>CREATED WITH AILIS & RODORIN / 2.1 BRANCH PREVIEW</p><div><Link href="/archive">2.0 ARCHIVE</Link><Link href="/classic">CLASSIC</Link><Link href="/roadmap">ROADMAP</Link><Link href="/stories">STORIES</Link></div><small>既存商品・Stripe処理は継承。ゲーム展示は無料。3D展示と販売商品の内容はそれぞれ別にご確認ください。</small></footer>
  </div>;
}
