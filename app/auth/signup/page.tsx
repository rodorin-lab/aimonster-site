"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell, { FieldLabel, TextInput, ErrorText } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/app/auth/signin/page";
import { useLang } from "@/lib/i18n";

export default function SignUpPage() {
  const { t } = useLang();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || t({ en: "Something went wrong.", ja: "エラーが発生しました。" }));
      setLoading(false);
      return;
    }
    if (data.verificationRequired) {
      router.push("/auth/verify-email?sent=1");
      return;
    }
    // No email service configured — account was auto-verified, sign in immediately.
    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      router.push("/auth/signin");
      return;
    }
    router.push("/membership");
    router.refresh();
  }

  return (
    <AuthShell
      title={t({ en: "JOIN THE RANCH", ja: "牧場に参加する" })}
      subtitle={t({ en: "Free — just an email and a password.", ja: "無料 — メールアドレスとパスワードだけ。" })}
    >
      <GoogleButton />
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 14, marginTop: 14 }}>
        <div>
          <FieldLabel htmlFor="name">{t({ en: "NAME (optional)", ja: "名前(任意)" })}</FieldLabel>
          <TextInput id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="email">EMAIL</FieldLabel>
          <TextInput id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="password">{t({ en: "PASSWORD (8+ characters)", ja: "パスワード(8文字以上)" })}</FieldLabel>
          <TextInput id="password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <ErrorText>{error}</ErrorText>
        <button className="btn btn-solid ac-green" type="submit" disabled={loading} style={{ marginTop: 4, cursor: loading ? "wait" : "pointer" }}>
          {loading ? t({ en: "Creating account…", ja: "作成中…" }) : t({ en: "▸ Create Account", ja: "▸ 登録する" })}
        </button>
      </form>
      <div style={{ textAlign: "center", marginTop: 16, fontSize: "0.82rem" }}>
        <Link href="/auth/signin" style={{ color: "var(--cyan)" }}>{t({ en: "Already have an account? Sign in", ja: "アカウントをお持ちの方はこちら" })}</Link>
      </div>
    </AuthShell>
  );
}
