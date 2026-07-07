"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell, { FieldLabel, TextInput, ErrorText, SuccessText } from "@/components/auth/AuthShell";
import { useLang } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || t({ en: "Something went wrong.", ja: "エラーが発生しました。" }));
      return;
    }
    setDone(
      data.note ||
        t({ en: "If that email is registered, a reset link is on its way.", ja: "登録されていれば、リセット用リンクを送信しました。" }),
    );
  }

  return (
    <AuthShell title={t({ en: "RESET PASSWORD", ja: "パスワード再設定" })} subtitle={t({ en: "We'll email you a reset link.", ja: "リセット用のリンクをメールで送ります。" })}>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
        <div>
          <FieldLabel htmlFor="email">EMAIL</FieldLabel>
          <TextInput id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <ErrorText>{error}</ErrorText>
        <SuccessText>{done}</SuccessText>
        <button className="btn btn-solid ac-cyan" type="submit" disabled={loading} style={{ cursor: loading ? "wait" : "pointer" }}>
          {loading ? t({ en: "Sending…", ja: "送信中…" }) : t({ en: "▸ Send reset link", ja: "▸ 送信する" })}
        </button>
      </form>
      <div style={{ textAlign: "center", marginTop: 16, fontSize: "0.82rem" }}>
        <Link href="/auth/signin" style={{ color: "var(--cyan)" }}>{t({ en: "Back to sign in", ja: "ログインに戻る" })}</Link>
      </div>
    </AuthShell>
  );
}
