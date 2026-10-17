"use client";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { arcadeGames, PASSPORT_KEY, type ArcadeGame } from "@/lib/arcade";
import s from "./neon.module.css";
const Room=dynamic(()=>import("./ArcadeRoom"),{ssr:false,loading:()=> <div className={s.roomLoading}>✧ 格納庫を組み立てています…</div>});
class RoomBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return{failed:true};}render(){return this.state.failed?<p className={s.roomLoading}>3Dを起動できませんでした。下のゲーム一覧から遊べます。</p>:this.props.children;}}

function GameSession({game,onClose}:{game:ArcadeGame;onClose:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const [message,setMessage]=useState("");
  useEffect(()=>{const d=dialog.current;d?.showModal();const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{d?.close();document.body.style.overflow=previous;};},[]);
  async function full(){try{if(document.fullscreenElement)await document.exitFullscreen();else await dialog.current?.requestFullscreen();}catch{setMessage("全画面表示はこのブラウザーでは利用できません。");}}
  function close(){if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{});onClose();}
  return <dialog ref={dialog} className={s.gameDialog} onCancel={e=>{e.preventDefault();close();}} aria-label={`${game.title} プレイ画面`}><div className={s.sessionHeader}><div><small>NOW PLAYING / {game.genre}</small><h2>{game.title}</h2></div><div><button onClick={full}>全画面 ↗</button><button autoFocus onClick={close} data-testid="close-game">筐体へ戻る ×</button></div></div><p className={s.controls}>{game.controls}</p><iframe key={game.id} title={`${game.title} ゲーム`} src={game.src} allow="fullscreen; autoplay; gamepad" sandbox="allow-scripts allow-same-origin allow-downloads allow-popups" onLoad={()=>setMessage("ゲームを読み込みました。画面内をクリックして操作してください。")} /><p className={s.sessionNote} role="status">{message||"ゲームを読み込み中…"} · 終了するとゲームの実行と音を停止します。</p></dialog>;
}

export default function LivingArcade(){
  const [active,setActive]=useState(0);
  const [session,setSession]=useState<ArcadeGame|null>(null);
  const [visits,setVisits]=useState<string[]>([]);
  const [storageError,setStorageError]=useState(false);
  const [room,setRoom]=useState(false);
  const [motion,setMotion]=useState(false);
  const [style,setStyle]=useState("nebula");
  const g=arcadeGames[active];
  useEffect(()=>{const timer=setTimeout(()=>{try{const saved:unknown=JSON.parse(localStorage.getItem(PASSPORT_KEY)||"[]");if(Array.isArray(saved))setVisits([...new Set(saved.filter((id):id is string=>typeof id==="string"&&arcadeGames.some(g=>g.id===id)))]);}catch{setStorageError(true);}const id=new URLSearchParams(location.search).get("game");const index=arcadeGames.findIndex(g=>g.id===id);if(index>=0)setActive(index);},0);return()=>clearTimeout(timer);},[]);
  function play(game:ArcadeGame){setSession(game);const next=[...new Set([...visits,game.id])];setVisits(next);try{localStorage.setItem(PASSPORT_KEY,JSON.stringify(next));}catch{setStorageError(true);}}
  return <div className={`${s.shell} ${s.arcadeShell} ${style==="solar"?s.solar:""}`} style={{"--accent":g.color} as React.CSSProperties}>
    <a className={s.skip} href="#cabinet-list">ゲーム一覧へ移動</a><div className={s.stars} aria-hidden="true"/>
    <header className={s.nav}><Link href="/" className={s.brand}>M<span>✳</span>F <small>MONSTER FACTORY<br/>THE LIVING ARCADE</small></Link><nav aria-label="アーケードナビゲーション"><Link href="/">HOME</Link><Link href="/archive#market">MARKET ↗</Link><a href="#passport">PASSPORT</a></nav></header>
    <main><section className={s.arcadeIntro}><p className={s.kicker}>SECTOR 02 / AI-MADE WORLDS, HUMAN-SIZED WONDER</p><h1>THE LIVING<br/><span>ARCADE.</span></h1><p>ここでは、作品が世界になる。<br/>好きな筐体へ。次の冒険は、もう起動している。</p><div className={s.arcadeStats}><span><b>{String(arcadeGames.length).padStart(2,"0")}</b> PLAYABLE WORLDS</span><span><b>∞</b> CONTINUES</span><span><b>$0</b> ADMISSION</span></div></section>
      <section className={s.roomSection} aria-label="3Dアーケード観察室"><div className={s.roomToolbar}><span>ORBITAL GAME HANGAR / {room?"3D ONLINE":"STANDBY"}</span><div><button onClick={()=>setStyle(v=>v==="solar"?"nebula":"solar")} aria-pressed={style==="solar"}>配色：{style==="solar"?"SOLAR":"NEBULA"}</button>{room&&<button onClick={()=>setMotion(v=>!v)} aria-pressed={motion}>自動演出 {motion?"ON":"OFF"}</button>}<button onClick={()=>setRoom(v=>!v)} aria-pressed={room}>{room?"3Dを終了":"3Dルームを起動"}</button></div></div>
        <div className={s.room}>{room&&!session?<RoomBoundary><Room active={active} onSelect={setActive} motion={motion}/></RoomBoundary>:<div className={s.roomStandby}><div className={s.hangarArt} aria-hidden="true">{arcadeGames.map((v,i)=><button key={v.id} style={{"--accent":v.color} as React.CSSProperties} onClick={()=>setActive(i)} tabIndex={-1}><span>{v.icon}</span><i/><b>0{i+1}</b></button>)}</div><h2>{session?"GAME IN PROGRESS":"YOUR NEXT WORLD IS WAITING."}</h2><p>下の一覧からすぐプレイ。3Dルームは必要なときだけ起動できます。</p>{!room&&<button className={s.primary} onClick={()=>setRoom(true)}>格納庫を3Dで観察する ↗</button>}</div>}</div>
        <div className={s.selection}><div><small>SELECTED CABINET / 0{active+1}</small><h2>{g.title}</h2><p>{g.description}</p></div><button className={s.primary} onClick={()=>play(g)} data-testid="play-selected">この世界で遊ぶ ↗</button></div><p className={s.roomHint}>3Dはドラッグで視点回転・ピンチ／ホイールで拡大。筐体を選び「この世界で遊ぶ」で起動。現在はデスクトップ／モバイル向け。没入型VRは未実装です。</p>
      </section>
      <section id="cabinet-list" className={s.section}><div className={s.sectionHeader}><div><p className={s.kicker}>01 / PICK A CABINET</p><h2>さあ、<span>どこへ行く？</span></h2></div><p>ゲーム本体は選んだ1本だけ読み込みます。<br/>3Dが使えなくても、ここから遊べます。</p></div><div className={s.gameGrid}>{arcadeGames.map((game,i)=><article key={game.id} className={s.gameCard} style={{"--accent":game.color} as React.CSSProperties}><div className={s.gameCover}>{game.cover?<Image src={game.cover} alt={`${game.title} 実ゲーム画面`} fill sizes="(max-width:800px) 90vw, 33vw"/>:<div className={s.starArt}>✦<span>★</span>✧</div>}<span className={s.gameIndex}>0{i+1} / {visits.includes(game.id)?"VISITED":"NEW ADVENTURE"}</span></div><div className={s.gameInfo}><small>{game.genre}</small><h3>{game.title}</h3><p>{game.description}</p><p className={s.controlText}>{game.controls}</p><small>{game.credit}</small><div className={s.cardActions}><button className={s.primary} onClick={()=>play(game)} data-game={game.id}>PLAY ↗</button><button className={s.secondary} onClick={()=>{setActive(i);document.querySelector('[aria-label="3Dアーケード観察室"]')?.scrollIntoView({behavior:"instant"});}}>筐体を選択</button></div></div></article>)}</div></section>
      <section id="passport" className={`${s.section} ${s.passport}`}><p className={s.kicker}>02 / YOUR EXPLORER PASSPORT</p><h2>冒険の足跡を、<span>持ち帰ろう。</span></h2><p>ゲームを開くと訪問スタンプが増えます。クリア実績・購入履歴ではありません。このブラウザー内にだけ保存されます。</p><div className={s.stamps}>{arcadeGames.map(game=><div key={game.id} data-visited={visits.includes(game.id)}><span>{visits.includes(game.id)?game.icon:"?"}</span><b>{game.title}</b><small>{visits.includes(game.id)?"VISITED / 訪問済み":"UNEXPLORED / 未訪問"}</small></div>)}</div>{visits.length===arcadeGames.length&&<p className={s.reward} role="status">✧ FIRST EXPLORER — すべての展示世界を訪ねた、最初の探検家へ。</p>}{storageError&&<p role="status">ブラウザー保存が使えません。訪問記録は今回の画面内でのみ保持します。</p>}</section>
      <section className={s.manifesto}><p className={s.kicker}>FROM PLAYER TO WORLD BUILDER</p><h2>次は、あなたが<br/><em>世界をつくる番。</em></h2><p>モンスターの素材と物語は、アーカイブのマーケットへ。<br/>展示ゲーム自体の販売や、ゲーム内素材との同一性を保証するものではありません。</p><Link className={s.primary} href="/archive#market">クリーチャー素材を探す ↗</Link></section>
    </main><footer className={s.footer}><b>THE LIVING ARCADE / AILIS × RODORIN</b><div><Link href="/">HOME</Link><Link href="/archive">ARCHIVE</Link><Link href="/classic">CLASSIC</Link></div><small>6作品を同梱。未確認の作品は準備でき次第追加します。音は各ゲームの設定で調整してください。</small></footer>
    {session&&<GameSession game={session} onClose={()=>setSession(null)}/>}
  </div>;
}
