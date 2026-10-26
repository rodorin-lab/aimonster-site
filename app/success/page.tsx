"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLang, bi } from "@/lib/i18n";
import { findPack } from "@/lib/packs";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/motion";
import { Corners } from "@/components/shared";

function SuccessInner() {
  const { t } = useLang();
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [verificationState, setState] = useState<"checking" | "paid" | "unpaid" | "error">("checking");
  const state = sessionId ? verificationState : "error";
  const [delivery, setDelivery] = useState("pending");
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setState("error"); return; }
        setProductId(d.productId);
        setDelivery(d.delivery);
        setState(d.paid ? "paid" : "unpaid");
      })
      .catch(() => setState("error"));
  }, [sessionId]);

  const pack = productId ? findPack(productId) : undefined;

  return (
    <PageShell accent="green">
      <div className="wrap" style={{ padding: "clamp(3rem,10vw,6rem) clamp(1rem,4vw,2.5rem)", maxWidth: 640, textAlign: "center" }}>
        <Reveal>
          <div className="holo ac-green anim-border" style={{ padding: "2.4rem 2rem" }}>
            <Corners />
            {state === "checking" && <p className="font-mono blink" style={{ color: "var(--green)" }}>{t(bi("Verifying your purchase…", "購入内容を確認中…"))}</p>}
            {state === "paid" && (
              <>
                <div className="font-display neon" style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 12 }}>{t(bi("THANK YOU.", "ありがとうございます。"))}</div>
                <p style={{ color: "var(--text)", marginBottom: 18 }}>
                  {pack
                    ? t(bi(`Your ${pack.name} is confirmed.`, `${pack.name} のご購入が確認できました。`))
                    : t(bi("Your purchase is confirmed.", "ご購入が確認できました。"))}
                </p>
                <p className="font-mono" style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>
                  {t(delivery === "email_sent" ? bi("Your download email has been accepted for sending. Please check your inbox and spam folder.", "ダウンロードメールの送信を受け付けました。受信箱と迷惑メールをご確認ください。") : bi("Delivery is being prepared. If no email arrives, contact support with your Stripe receipt. Please do not pay again.", "配布を準備中です。メールが届かない場合はStripeの領収書を添えてサポートへご連絡ください。再購入は不要です。"))}
                </p>
              </>
            )}
            {state === "unpaid" && <p style={{ color: "var(--orange)" }}>{t(bi("Payment not confirmed yet. If you completed checkout, please contact support.", "決済がまだ確認できていません。決済を完了された場合はサポートへご連絡ください。"))}</p>}
            {state === "error" && <p style={{ color: "var(--orange)" }}>{t(bi("We couldn't verify this session.", "このセッションを確認できませんでした。"))}</p>}
            <div style={{ marginTop: 24 }}>
              <Link className="btn ac-green" href="/">▸ {t(bi("Back to the lab", "ラボへ戻る"))}</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessInner />
    </Suspense>
  );
}
