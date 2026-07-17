"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthShell, { FieldLabel, TextInput, ErrorText, SuccessText } from "@/components/auth/AuthShell";
import { useLang } from "@/lib/i18n";

function ResetPasswordForm() {
  const { t } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const token = params?.get("token") || "";
  const email = params?.get("email") || "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || t({ en: "Something went wrong.", ja: "エラーが発生しました。" }));
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/auth/signin"), 1500);
  }

  if (!token || !email) {
    return (
      <AuthShell title={t({ en: "INVALID LINK", ja: "無効なリンク" })}>
        <ErrorText>{t({ en: "This reset link is missing required information.", ja: "このリンクは無効です。" })}</ErrorText>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={t({ en: "SET NEW PASSWORD", ja: "新しいパスワード" })}>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
        <div>
          <FieldLabel htmlFor="password">{t({ en: "NEW PASSWORD (8+ characters)", ja: "新しいパスワード(8文字以上)" })}</FieldLabel>
          <TextInput id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <ErrorText>{error}</ErrorText>
        <SuccessText>{done ? t({ en: "Password updated — redirecting to sign in…", ja: "更新しました。ログイン画面へ移動します…" }) : null}</SuccessText>
        <button className="btn btn-solid ac-cyan" type="submit" style={{ cursor: "pointer" }}>
          {t({ en: "▸ Update password", ja: "▸ 更新する" })}
        </button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
