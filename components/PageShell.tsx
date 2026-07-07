"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { brand } from "@/lib/content";
import Background from "@/components/Background";
import type { Accent } from "@/lib/content";

export function SubNav() {
  const { lang, toggle } = useLang();
  return (
    <header className="fixed inset-x-0 top-0 z-50" style={{ background: "rgba(5,7,13,0.85)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(0,255,240,0.14)" }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <Link href="/" className="font-display" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", color: "var(--text)" }}>
          <span style={{ color: "var(--cyan)", fontSize: 17, textShadow: "0 0 12px rgba(0,255,240,0.6)" }}>⬡</span>
          <span style={{ display: "block", fontWeight: 800, letterSpacing: "0.08em", fontSize: 13 }}>{brand.name}</span>
        </Link>
        <button onClick={toggle} className="font-mono" aria-label="Toggle language" style={{ cursor: "pointer", padding: "5px 10px", fontSize: 12, fontWeight: 700, color: "var(--cyan)", background: "rgba(0,255,240,0.08)", border: "1px solid rgba(0,255,240,0.35)", borderRadius: 2, letterSpacing: "0.1em" }}>
          {lang === "en" ? "EN" : "日本語"}
        </button>
      </div>
    </header>
  );
}

export function PageShell({ children, accent = "cyan" }: { children: React.ReactNode; accent?: Accent }) {
  return (
    <div className={`ac-${accent}`}>
      <Background />
      <div className="fx-overlay" />
      <div className="scan-sweep" />
      <SubNav />
      <main style={{ position: "relative", zIndex: 2, paddingTop: 58 }}>{children}</main>
    </div>
  );
}
