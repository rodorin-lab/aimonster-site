"use client";

import { useEffect, useState } from "react";
import { useLang, bi, type Bi } from "@/lib/i18n";

// One-time entrance sequence. NOT a fake generation/loading progress bar
// (spec explicitly forbids that) — just a system boot log, same pattern
// used across the Digital Lifeform Lab family. Skips on repeat visits
// and honors prefers-reduced-motion.
const BOOT: Bi[] = [
  bi("> booting AI MONSTER FACTORY…", "> AI MONSTER FACTORY を起動中…"),
  bi("> loading creature codex …… OK", "> クリーチャー図鑑を読込 …… OK"),
  bi("> evolution lab: online", "> 進化ラボ: 稼働中"),
  bi("> status: GROWING", "> ステータス: GROWING"),
];

export default function Boot() {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("amf-booted") === "1"; } catch { /* ignore */ }
    if (reduced || seen) { setDone(true); return; }
    try { sessionStorage.setItem("amf-booted", "1"); } catch { /* ignore */ }

    const timers: number[] = [];
    BOOT.forEach((_, i) => { timers.push(window.setTimeout(() => setLine(i + 1), 340 * (i + 1))); });
    timers.push(window.setTimeout(() => setDone(true), 340 * BOOT.length + 550));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`boot ${done ? "done" : ""}`} aria-hidden={done}>
      <div className="wrap" style={{ maxWidth: 620 }}>
        <div className="font-mono" style={{ fontSize: "0.85rem", color: "var(--cyan)" }}>
          {BOOT.slice(0, line).map((b, i) => <div key={i} style={{ marginBottom: 6, textShadow: "0 0 10px rgba(0,255,240,0.4)" }}>{t(b)}</div>)}
          <span className="blink" style={{ color: "var(--cyan)" }}>█</span>
        </div>
      </div>
    </div>
  );
}
