import Link from "next/link";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { findPack } from "@/lib/packs";
import { Corners } from "@/components/shared";

export default async function PurchasesPage() {
  const session = await requireUser();
  const purchases = await prisma.purchase.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 16 }}>🛒 購入履歴</h1>
      {purchases.length === 0 ? (
        <p style={{ color: "var(--text-dim)" }}>
          まだ購入がありません。<Link href="/#packs" style={{ color: "var(--cyan)" }}>パック一覧</Link>を見てみよう。
        </p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {purchases.map((p) => {
            const pack = findPack(p.packSlug);
            const canDownload = p.status === "succeeded" && p.downloadToken && (!p.downloadExpiresAt || p.downloadExpiresAt > new Date());
            return (
              <div key={p.id} className="holo ac-cyan" style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <Corners />
                <div>
                  <div style={{ fontWeight: 700 }}>{pack?.name ?? p.packSlug}</div>
                  <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
                    {new Date(p.createdAt).toLocaleDateString("ja-JP")} ・ ${(p.amountCents / 100).toFixed(2)} ・ {p.status}
                  </div>
                </div>
                {canDownload ? (
                  <a href={`/api/download/${p.downloadToken}`} className="btn btn-solid ac-green">▸ ダウンロード</a>
                ) : (
                  <span className="chip">{p.status === "succeeded" ? "期限切れ" : p.status}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
