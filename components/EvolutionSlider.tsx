"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { evolution, type StageId } from "@/lib/content";
import { Corners } from "@/components/shared";

const Creature3D = dynamic(() => import("@/components/Creature3D"), {
  ssr: false,
  loading: () => (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className="font-mono blink" style={{ color: "var(--cyan)", fontSize: "0.8rem" }}>LOADING…</span>
    </div>
  ),
});

// The flagship interactive piece: Fire Dragon's real evolution, stage by
// stage. PIXEL and 3D are real and shown as such; ANIME and GAME are
// clearly marked "in progress" / "roadmap" — never faked as complete.
export default function EvolutionSlider() {
  const { t } = useLang();
  const [active, setActive] = useState<StageId>("pixel");

  return (
    <div>
      <div className="evo-track holo ac-cyan" style={{ aspectRatio: "16/10", marginBottom: 18 }}>
        <Corners />
        <div className={`evo-frame ${active === "pixel" ? "active" : ""}`}>
          <div style={{ position: "relative", width: "70%", height: "70%" }}>
            <Image src="/monsters/dragon_fire.png" alt="Fire Dragon — pixel stage" fill style={{ objectFit: "contain" }} />
          </div>
        </div>
        <div className={`evo-frame ${active === "anime" ? "active" : ""}`}>
          <div style={{ textAlign: "center", padding: "0 2rem" }}>
            <div className="font-display neon" style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 10 }}>
              {t({ en: "ANIME STAGE — IN PROGRESS", ja: "ANIME段階 — 制作中" })}
            </div>
            <p className="font-mono" style={{ color: "var(--text-faint)", fontSize: "0.82rem" }}>
              {t({ en: "Not shipped yet. We'd rather show you nothing than fake it.", ja: "まだ出荷していません。偽物を見せるより、何も見せない方を選びます。" })}
            </p>
          </div>
        </div>
        <div className={`evo-frame ${active === "three_d" ? "active" : ""}`} style={{ inset: 0 }}>
          {active === "three_d" && <Creature3D src="/monsters/3d/monster.glb" />}
        </div>
        <div className={`evo-frame ${active === "game" ? "active" : ""}`}>
          <div style={{ textAlign: "center", padding: "0 2rem" }}>
            <div className="font-display neon" style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 10 }}>
              {t({ en: "GAME STAGE — ROADMAP", ja: "GAME段階 — 構想中" })}
            </div>
            <p className="font-mono" style={{ color: "var(--text-faint)", fontSize: "0.82rem" }}>
              {t({ en: "This is where a creature becomes an enemy, a boss, a companion. Still ahead of us.", ja: "ここでクリーチャーは敵に、ボスに、仲間になる。まだ、その先にある。" })}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 8 }}>
        {evolution.stages.map((s) => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span className={`evo-dot ${active === s.id ? "active" : ""}`} />
            <span className="font-mono" style={{ fontSize: "0.72rem", letterSpacing: "0.1em", color: active === s.id ? "var(--cyan)" : "var(--text-faint)" }}>{s.label}</span>
          </button>
        ))}
      </div>
      <p className="font-mono" style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--text-faint)", marginTop: 6 }}>
        {t({ en: "Drag the 3D stage to rotate it yourself.", ja: "3D段階はドラッグで自分で回せます。" })}
      </p>
    </div>
  );
}
