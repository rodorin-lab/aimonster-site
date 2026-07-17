"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { useLang } from "@/lib/i18n";

function VerifyEmailBody() {
  const { t } = useLang();
  const params = useSearchParams();
  const justSent = params?.get("sent") === "1";

  return (
    <AuthShell title={t({ en: "CHECK YOUR EMAIL", ja: "メールを確認してください" })}>
      <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", textAlign: "center", lineHeight: 1.6 }}>
        {justSent
          ? t({
              en: "We sent a verification link to your email. Click it to activate your account, then sign in.",
              ja: "確認リンクをメールで送りました。リンクをクリックしてアカウントを有効化してから、ログインしてください。",
            })
          : t({ en: "Waiting for email verification.", ja: "メール確認待ちです。" })}
      </p>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Link href="/auth/signin" className="btn">{t({ en: "Back to sign in", ja: "ログインに戻る" })}</Link>
      </div>
    </AuthShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailBody />
    </Suspense>
  );
}
