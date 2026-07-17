"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { nav, brand, LINKS } from "@/lib/content";

export default function Nav() {
  const { t, lang, toggle } = useLang();
  const [active, setActive] = useState("hero");
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ids = ["hero", ...nav.map((n) => n.id)];
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });

    const onScroll = () => {
      const st = window.scrollY;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(dh > 0 ? (st / dh) * 100 : 0);
      setScrolled(st > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  const go = (id: string) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <header className="fixed inset-x-0 top-0 z-50" style={{ background: scrolled ? "rgba(5,7,13,0.85)" : "transparent", backdropFilter: scrolled ? "blur(10px)" : "none", borderBottom: scrolled ? "1px solid rgba(0,255,240,0.14)" : "1px solid transparent", transition: "background 0.3s ease, border-color 0.3s ease" }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, gap: 12 }}>
        <Link href="/" className="font-display" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", color: "var(--text)" }}>
          <span className="float" style={{ color: "var(--cyan)", fontSize: 18, textShadow: "0 0 12px rgba(0,255,240,0.6)" }}>⬡</span>
          <span style={{ lineHeight: 1 }}>
            <span style={{ display: "block", fontWeight: 800, letterSpacing: "0.08em", fontSize: 13 }}>AI MONSTER FACTORY</span>
            <span className="font-mono" style={{ display: "block", fontSize: 8, letterSpacing: "0.2em", color: "var(--magenta)", marginTop: 2 }}>{t(brand.sub)}</span>
          </span>
        </Link>

        <nav className="hidden lg:flex" style={{ alignItems: "center", gap: 2 }}>
          {nav.map((n) => (
            <button key={n.id} onClick={() => go(n.id)} className="font-mono" style={{ background: "none", border: 0, cursor: "pointer", padding: "6px 10px", fontSize: 12, letterSpacing: "0.07em", color: active === n.id ? "var(--cyan)" : "var(--text-dim)", textShadow: active === n.id ? "0 0 10px rgba(0,255,240,0.5)" : "none", transition: "color 0.2s ease" }}>
              <span style={{ opacity: 0.5, marginRight: 5 }}>{n.ch}</span>{t(n.label)}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={toggle} className="font-mono" aria-label="Toggle language" style={{ cursor: "pointer", padding: "5px 10px", fontSize: 12, fontWeight: 700, color: "var(--cyan)", background: "rgba(0,255,240,0.08)", border: "1px solid rgba(0,255,240,0.35)", borderRadius: 2, letterSpacing: "0.1em" }}>
            {lang === "en" ? "EN" : "日本語"}
          </button>
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="font-mono hidden sm:inline-flex" style={{ fontSize: 12, color: "var(--text-dim)", textDecoration: "none", letterSpacing: "0.08em" }}>▸ GITHUB</a>
          <button onClick={() => setOpen((o) => !o)} className="lg:hidden" aria-label="Menu" style={{ background: "none", border: 0, color: "var(--cyan)", cursor: "pointer", fontSize: 20 }}>{open ? "✕" : "≡"}</button>
        </div>
      </div>

      <div style={{ height: 2, background: "rgba(255,255,255,0.05)" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, var(--cyan), var(--magenta), var(--orange))", boxShadow: "0 0 10px rgba(0,255,240,0.6)", transition: "width 0.1s linear" }} />
      </div>

      {open && (
        <div className="lg:hidden" style={{ background: "rgba(5,7,13,0.97)", borderBottom: "1px solid rgba(0,255,240,0.18)", padding: "10px 0" }}>
          {nav.map((n) => (
            <button key={n.id} onClick={() => go(n.id)} className="font-mono wrap" style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: 0, cursor: "pointer", padding: "10px 0", fontSize: 14, color: active === n.id ? "var(--cyan)" : "var(--text-dim)" }}>
              <span style={{ opacity: 0.5, marginRight: 8 }}>{n.ch}</span>{t(n.label)}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
