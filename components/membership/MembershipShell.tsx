"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { RankBadge } from "./RankBadge";
import { useLang } from "@/lib/i18n";
import type { Rank } from "@/lib/rank";

const NAV = [
  { id: "", icon: "🏠", en: "Dashboard", ja: "ダッシュボード" },
  { id: "favorites", icon: "🐉", en: "Favorites", ja: "推しモン" },
  { id: "purchases", icon: "🛒", en: "Purchases", ja: "購入履歴" },
  { id: "billing", icon: "💳", en: "Billing", ja: "サブスク管理" },
  { id: "vote", icon: "🗳️", en: "Vote", ja: "投票" },
  { id: "digital-card", icon: "🪪", en: "Digital Card", ja: "会員証" },
  { id: "settings", icon: "⚙️", en: "Settings", ja: "設定" },
];

export function MembershipShell({
  name, rank, points, children,
}: { name: string; rank: Rank; points: number; children: React.ReactNode }) {
  const { t } = useLang();
  const pathname = usePathname();
  const active = (id: string) => {
    const full = id ? `/membership/${id}` : "/membership";
    return pathname === full;
  };

  return (
    <div className="wrap" style={{ display: "flex", gap: 28, alignItems: "flex-start", paddingTop: 28, paddingBottom: 90 }}>
      <aside className="membership-sidebar" style={{ width: 220, flexShrink: 0, position: "sticky", top: 78 }}>
        <div className="holo ac-cyan" style={{ padding: "1rem", marginBottom: 16 }}>
          <div style={{ fontWeight: 800, fontSize: "0.95rem", marginBottom: 6 }}>🐾 {name}</div>
          <RankBadge rank={rank} size="sm" />
          <div className="font-mono" style={{ color: "var(--text-faint)", fontSize: "0.72rem", marginTop: 8 }}>
            {points}pt
          </div>
        </div>
        <nav style={{ display: "grid", gap: 4 }}>
          {NAV.map((n) => (
            <Link
              key={n.id}
              href={n.id ? `/membership/${n.id}` : "/membership"}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "0.55em 0.8em",
                borderRadius: 4, textDecoration: "none", fontSize: "0.85rem",
                color: active(n.id) ? "var(--cyan)" : "var(--text-dim)",
                background: active(n.id) ? "rgba(0,255,240,0.08)" : "transparent",
                border: active(n.id) ? "1px solid rgba(0,255,240,0.3)" : "1px solid transparent",
              }}
            >
              <span>{n.icon}</span><span>{t({ en: n.en, ja: n.ja })}</span>
            </Link>
          ))}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.55em 0.8em", color: "var(--text-faint)", textDecoration: "none", fontSize: "0.85rem", marginTop: 8 }}>
            <span>🌐</span><span>{t({ en: "Back to site", ja: "サイトに戻る" })}</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.55em 0.8em", color: "var(--magenta)", background: "none", border: "none", textAlign: "left", fontSize: "0.85rem", cursor: "pointer" }}
          >
            <span>🚪</span><span>{t({ en: "Sign out", ja: "ログアウト" })}</span>
          </button>
        </nav>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>{children}</main>

      <nav className="membership-bottomnav">
        {NAV.slice(0, 5).map((n) => (
          <Link key={n.id} href={n.id ? `/membership/${n.id}` : "/membership"} style={{ color: active(n.id) ? "var(--cyan)" : "var(--text-faint)" }}>
            <span style={{ fontSize: "1.2rem" }}>{n.icon}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
