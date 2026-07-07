import { requireUser } from "@/lib/permissions";
import { Corners } from "@/components/shared";

export default async function DigitalCardPage() {
  await requireUser();
  return (
    <div style={{ maxWidth: 560 }}>
      <h1 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 16 }}>🪪 デジタル会員証</h1>
      <div className="holo ac-cyan" style={{ padding: 0, overflow: "hidden" }}>
        <Corners />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/api/membership/card" alt="Digital membership card" style={{ width: "100%", display: "block" }} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <a href="/api/membership/card" download="membership-card.png" className="btn btn-solid ac-cyan">▸ PNGでダウンロード</a>
      </div>
      <p style={{ color: "var(--text-faint)", fontSize: "0.8rem", marginTop: 12 }}>
        X(Twitter)などにそのままシェアできます。推しモンを登録すると会員証にも表示されます。
      </p>
    </div>
  );
}
