"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { CRYSTALS, ROUND_SECONDS, hazardsAt, newRound, stepRound, type Round } from "@/lib/resonance";
import s from "./world.module.css";

type Status = "ready" | "running" | "paused" | "won" | "lost";
type Score = { count: number; hp: number; seconds: number };
const movementKeys = ["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d"];

function Field({ keys, status, report }: { keys: RefObject<Set<string>>; status: Status; report: (state: Round) => void }) {
  const simulation = useRef(newRound());
  const player = useRef<Group>(null);
  const crystals = useRef<(Mesh | null)[]>([]);
  const hazards = useRef<(Mesh | null)[]>([]);
  const lastReport = useRef("");

  useFrame((_, delta) => {
    if (status === "running") {
      const k = keys.current;
      const dx = Number(k.has("d") || k.has("arrowright")) - Number(k.has("a") || k.has("arrowleft"));
      const dz = Number(k.has("s") || k.has("arrowdown")) - Number(k.has("w") || k.has("arrowup"));
      simulation.current = stepRound(simulation.current, dx, dz, delta);
    }
    const state = simulation.current;
    if (player.current) {
      player.current.position.set(state.x, .38, state.z);
      player.current.scale.y = state.shield > 0 ? .8 : 1;
    }
    crystals.current.forEach((mesh,i) => {
      if (!mesh) return;
      mesh.visible = !state.collected[i];
      mesh.rotation.y = state.elapsed * 1.4;
    });
    hazardsAt(state.elapsed).forEach(([x,z],i) => hazards.current[i]?.position.set(x,.25,z));
    const signature = `${Math.ceil(ROUND_SECONDS-state.elapsed)}:${state.hp}:${state.collected.join("")}:${state.status}`;
    if (lastReport.current !== signature && status === "running") { lastReport.current = signature; report(state); }
  });

  return <>
    <color attach="background" args={["#101b16"]} />
    <ambientLight intensity={1.4} />
    <hemisphereLight args={["#e7ffd8", "#163023", 2]} />
    <directionalLight position={[5,8,4]} intensity={3} color="#e9ffdc" />
    <pointLight position={[-4,3,-4]} intensity={18} color="#00fff0" />
    <mesh position={[0,-.3,0]}><boxGeometry args={[8.6,.6,8.6]} /><meshStandardMaterial color="#344c30" roughness={.9} /></mesh>
    <gridHelper args={[8,16,"#67885a","#47613e"]} position={[0,.01,0]} />
    {[[-4,-4],[-4,4],[4,-4],[4,4]].map(([x,z],i) => <group key={i} position={[x,.25,z]}><mesh><cylinderGeometry args={[.13,.22,.5,6]} /><meshStandardMaterial color="#98b880" /></mesh><mesh position={[0,.4,0]}><octahedronGeometry args={[.16]} /><meshStandardMaterial color="#00fff0" emissive="#00fff0" emissiveIntensity={.8} /></mesh></group>)}
    <group ref={player} position={[0,.38,0]}>
      <mesh><sphereGeometry args={[.42,24,16]} /><meshStandardMaterial color="#94e6a4" roughness={.3} metalness={.1} /></mesh>
      <mesh position={[-.14,.09,.35]}><sphereGeometry args={[.075,12,8]} /><meshStandardMaterial color="#10281a" /></mesh>
      <mesh position={[.14,.09,.35]}><sphereGeometry args={[.075,12,8]} /><meshStandardMaterial color="#10281a" /></mesh>
      <mesh position={[0,.47,0]}><coneGeometry args={[.1,.3,5]} /><meshStandardMaterial color="#00fff0" emissive="#00fff0" emissiveIntensity={.3} /></mesh>
    </group>
    {CRYSTALS.map(([x,z],i) => <mesh key={i} ref={mesh => { crystals.current[i] = mesh; }} position={[x,.5,z]}><octahedronGeometry args={[.3]} /><meshStandardMaterial color="#00fff0" emissive="#00fff0" emissiveIntensity={.5} roughness={.2} metalness={.3} /></mesh>)}
    {[0,1].map(i => <mesh key={i} ref={mesh => { hazards.current[i] = mesh; }}><torusGeometry args={[.4,.12,8,24]} /><meshStandardMaterial color="#ff624e" emissive="#ff4020" emissiveIntensity={.6} /></mesh>)}
  </>;
}

export default function ResonanceArena({ ja }: { ja: boolean }) {
  const [status, setStatus] = useState<Status>("ready");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState<Score>({ count: 0, hp: 3, seconds: ROUND_SECONDS });
  const keys = useRef(new Set<string>());
  const field = useRef<HTMLDivElement>(null);
  const text = (jp: string, en: string) => ja ? jp : en;

  useEffect(() => {
    const clear = () => { keys.current.clear(); setStatus(old => old === "running" ? "paused" : old); };
    const hidden = () => { if (document.hidden) clear(); };
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", hidden);
    return () => { window.removeEventListener("blur", clear); document.removeEventListener("visibilitychange", hidden); };
  }, []);

  function start() {
    keys.current.clear();
    setRound(v => v + 1);
    setScore({ count: 0, hp: 3, seconds: ROUND_SECONDS });
    setStatus("running");
    field.current?.focus({ preventScroll: true });
  }
  function report(state: Round) {
    setScore({ count: state.collected.filter(Boolean).length, hp: state.hp, seconds: Math.max(0,Math.ceil(ROUND_SECONDS-state.elapsed)) });
    if (state.status !== "running") { keys.current.clear(); setStatus(state.status); }
  }
  function pause() { keys.current.clear(); setStatus("paused"); }

  return <div className={s.gameShell}>
    <div className={s.gameHud}><span>RESONANCE / 001</span><span data-testid="game-score">◈ {score.count} / 6</span><span data-testid="game-hp">HP {score.hp} / 3</span><span data-testid="game-time">{score.seconds}s</span><button className={s.pauseButton} disabled={status !== "running"} onClick={pause}>{text("一時停止", "Pause")}</button></div>
    <div ref={field} className={s.gameCanvas} tabIndex={0} role="group" aria-label={text("3D実験場。矢印キーかWASDで移動。Escapeで一時停止。", "3D playground. Arrow keys or WASD to move. Escape to pause.")} onBlur={e => { if (!e.currentTarget.parentElement?.contains(e.relatedTarget)) { keys.current.clear(); setStatus(old => old === "running" ? "paused" : old); } }} onKeyDown={e => { const key = e.key.toLowerCase(); if (movementKeys.includes(key)) { e.preventDefault(); keys.current.add(key); } if (key === "escape" && status === "running") pause(); }} onKeyUp={e => { keys.current.delete(e.key.toLowerCase()); }}>
      <Canvas camera={{ position: [0,8,9], fov: 48 }} dpr={[1,1.5]} gl={{ antialias:true }} fallback={<div className={s.empty}>{text("WebGL非対応のため3Dを表示できません。", "WebGL is unavailable in this browser.")}</div>} onCreated={({ camera }) => camera.lookAt(0,0,0)}><Field key={round} keys={keys} status={status} report={report} /></Canvas>
    </div>
    <div className={s.gameControls}><p>{text("矢印 / WASD または右のボタンで移動 · Escで停止 · 画面を離れると自動停止", "Arrows / WASD or direction buttons · Esc to pause · Auto-pauses when you leave")}</p><div className={s.dpad}>{[["arrowleft","←"],["arrowup","↑"],["arrowdown","↓"],["arrowright","→"]].map(([key,arrow]) => <button key={key} aria-label={text(`移動 ${arrow}`,`Move ${arrow}`)} disabled={status !== "running"} onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); keys.current.add(key); }} onPointerUp={() => keys.current.delete(key)} onPointerCancel={() => keys.current.delete(key)} onLostPointerCapture={() => keys.current.delete(key)} onKeyDown={e => { if(e.key === " " || e.key === "Enter") { e.preventDefault(); keys.current.add(key); } }} onKeyUp={() => keys.current.delete(key)} onBlur={() => keys.current.delete(key)}>{arrow}</button>)}</div></div>
    {status !== "running" && <div className={s.gameOverlay}>
      <h3>{status === "won" ? "RESONANCE COMPLETE ✧" : status === "lost" ? "A NEW ATTEMPT AWAITS" : status === "paused" ? "WORLD ON HOLD" : "MEET YOUR RESONANCE"}</h3>
      <p>{status === "won" ? text("6つの結晶がそろった。小さな世界が、あなたに応えた。", "Six crystals gathered. A little world answered your call.") : status === "lost" ? text("パルスを避けながら、次の出会いへ。何度でも挑戦できます。", "Avoid the pulses and try a different path. Every attempt is a new beginning.") : status === "paused" ? text("時間は止まっています。準備ができたら、続きを。", "Time is frozen. Continue whenever you are ready.") : text("水色の結晶を6つ集めよう。赤い輪に触れるとHPが減り、中央へ戻ります。45秒・HP3。", "Gather six cyan crystals. Red rings cost one HP and return you to the center. 45 seconds, 3 HP.")}</p>
      <button onClick={status === "paused" ? () => { setStatus("running"); field.current?.focus({ preventScroll:true }); } : start}>{status === "paused" ? text("再開", "Resume") : text("スタート", "Start round")}</button>
      <span className={s.eyebrow} aria-live="polite">{status === "won" || status === "lost" ? `${score.count} / 6 · ${score.seconds}s remaining` : "NO ACCOUNT / NO PURCHASE / NO AUDIO"}</span>
    </div>}
  </div>;
}
