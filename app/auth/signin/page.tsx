"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, getProviders } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthShell, { FieldLabel, TextInput, ErrorText, SuccessText } from "@/components/auth/AuthShell";
import { useLang } from "@/lib/i18n";

function SignInForm() {
  const { t } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params?.get("callbackUrl") || "/membership";
  const justVerified = params?.get("verified") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError(t({ en: "Incorrect email or password.", ja: "メールアドレスかパスワードが違います。" }));
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <AuthShell
      title={t({ en: "SIGN IN", ja: "ログイン" })}
      subtitle={t({ en: "Come back to the ranch.", ja: "牧場へおかえりなさい。" })}
    >
      <GoogleButton />
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 14, marginTop: 14 }}>
        <div>
          <FieldLabel htmlFor="email">EMAIL</FieldLabel>
          <TextInput id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="password">{t({ en: "PASSWORD", ja: "パスワード" })}</FieldLabel>
          <TextInput id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <ErrorText>{error}</ErrorText>
        {justVerified && <SuccessText>{t({ en: "Email verified — sign in below.", ja: "メール確認できました。ログインしてください。" })}</SuccessText>}
        <button className="btn btn-solid ac-cyan" type="submit" disabled={loading} style={{ marginTop: 4, cursor: loading ? "wait" : "pointer" }}>
          {loading ? t({ en: "Signing in…", ja: "ログイン中…" }) : t({ en: "▸ Sign In", ja: "▸ ログイン" })}
        </button>
      </form>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: "0.82rem" }}>
        <Link href="/auth/forgot-password" style={{ color: "var(--text-dim)" }}>{t({ en: "Forgot password?", ja: "パスワードを忘れた?" })}</Link>
        <Link href="/auth/signup" style={{ color: "var(--cyan)" }}>{t({ en: "Create account →", ja: "新規登録 →" })}</Link>
      </div>
    </AuthShell>
  );
}

export function GoogleButton() {
  const { t } = useLang();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    getProviders().then((providers) => setEnabled(Boolean(providers?.google)));
  }, []);
  if (!enabled) return null;
  return (
    <button
      type="button"
      className="btn"
      onClick={() => signIn("google", { callbackUrl: "/membership" })}
      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
    >
      {t({ en: "Continue with Google", ja: "Googleで続ける" })}
    </button>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
