"use client";

import Link from "next/link";
import { brand } from "@/lib/content";
import { PageShell } from "@/components/PageShell";
import { Corners } from "@/components/shared";
import { Reveal } from "@/components/motion";

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <PageShell accent="cyan">
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100svh - 58px)", padding: "3rem 1rem" }}>
        <Reveal>
          <div className="holo ac-cyan" style={{ padding: "2.2rem 2rem", width: "min(420px, 92vw)" }}>
            <Corners />
            <Link href="/" className="font-display" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--text)", marginBottom: 20, justifyContent: "center" }}>
              <span style={{ color: "var(--cyan)", fontSize: 16 }}>⬡</span>
              <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: "0.08em" }}>{brand.name}</span>
            </Link>
            <h1 className="font-display chrome" style={{ fontSize: "1.5rem", fontWeight: 800, textAlign: "center", margin: "0 0 6px" }}>{title}</h1>
            {subtitle && <p style={{ color: "var(--text-dim)", textAlign: "center", fontSize: "0.88rem", margin: "0 0 20px" }}>{subtitle}</p>}
            {children}
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}

export function FieldLabel({ children, htmlFor }: { children: string; htmlFor: string }) {
  return <label htmlFor={htmlFor} className="font-mono" style={{ display: "block", fontSize: "0.72rem", color: "var(--text-faint)", letterSpacing: "0.08em", marginBottom: 6 }}>{children}</label>;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%", padding: "0.7em 0.9em", background: "rgba(0,255,240,0.05)",
        border: "1px solid rgba(0,255,240,0.3)", borderRadius: 4, color: "var(--text)",
        fontSize: "0.95rem", outline: "none", ...props.style,
      }}
    />
  );
}

export function ErrorText({ children }: { children: string | null }) {
  if (!children) return null;
  return <p style={{ color: "var(--magenta)", fontSize: "0.85rem", textShadow: "0 0 8px rgba(255,46,224,0.4)", margin: "8px 0 0" }}>⚠ {children}</p>;
}

export function SuccessText({ children }: { children: string | null }) {
  if (!children) return null;
  return <p style={{ color: "var(--green)", fontSize: "0.85rem", textShadow: "0 0 8px rgba(0,255,90,0.4)", margin: "8px 0 0" }}>✓ {children}</p>;
}
