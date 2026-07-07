"use client";

import { useEffect, useRef } from "react";

// Layered atmosphere: CSS aurora blobs + a canvas particle network.
// Pauses on hidden tabs, respects reduced motion, density capped by area.

type P = { x: number; y: number; vx: number; vy: number };

export default function Background() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let particles: P[] = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(110, Math.floor((w * h) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const LINK = 130;

    const drawNet = () => {
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 130 * 130) { const d = Math.sqrt(d2) || 1; p.x += (dx / d) * 0.6; p.y += (dy / d) * 0.6; }
      }
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK) {
            ctx.strokeStyle = `rgba(90,190,255,${(1 - dist / LINK) * 0.24})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        const near = Math.hypot(p.x - mouse.x, p.y - mouse.y) < 160;
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? 2.3 : 1.2, 0, Math.PI * 2);
        ctx.fillStyle = near ? "rgba(255,46,224,0.9)" : "rgba(0,255,240,0.65)";
        ctx.fill();
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,255,240,0.5)"; ctx.fill();
      }
    };

    let raf = 0;
    const frame = () => { ctx.clearRect(0, 0, w, h); drawNet(); raf = requestAnimationFrame(frame); };

    if (reduced) drawStatic();
    else raf = requestAnimationFrame(frame);

    const onVis = () => {
      if (reduced) return;
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: "var(--bg)" }} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{ overflow: "hidden" }} aria-hidden>
        <span className="aurora a1" />
        <span className="aurora a2" />
        <span className="aurora a3" />
      </div>
      <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" style={{ opacity: 0.55 }} />
      <style>{`
        .aurora { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.5; mix-blend-mode: screen; will-change: transform; }
        .aurora.a1 { width: 46vw; height: 46vw; left: -8vw; top: -10vw; background: radial-gradient(circle, rgba(0,255,240,0.42), transparent 65%); animation: drift1 24s ease-in-out infinite; }
        .aurora.a2 { width: 52vw; height: 52vw; right: -12vw; top: 18vh; background: radial-gradient(circle, rgba(255,46,224,0.38), transparent 65%); animation: drift2 30s ease-in-out infinite; }
        .aurora.a3 { width: 40vw; height: 40vw; left: 30vw; bottom: -14vw; background: radial-gradient(circle, rgba(0,255,90,0.3), transparent 65%); animation: drift3 27s ease-in-out infinite; }
        @keyframes drift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(8vw,6vh) scale(1.15); } }
        @keyframes drift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-7vw,4vh) scale(1.1); } }
        @keyframes drift3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(5vw,-6vh) scale(1.2); } }
        @media (prefers-reduced-motion: reduce) { .aurora { animation: none !important; } }
      `}</style>
    </>
  );
}
