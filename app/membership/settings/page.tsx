"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { FieldLabel, TextInput, ErrorText, SuccessText } from "@/components/auth/AuthShell";
import { Corners } from "@/components/shared";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(null);
    const res = await fetch("/api/membership/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password: password || undefined }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    await update({ name });
    setPassword("");
    setDone("保存しました。");
  }

  async function deactivate() {
    await fetch("/api/membership/profile", { method: "DELETE" });
    signOut({ callbackUrl: "/" });
  }

  return (
    <div style={{ display: "grid", gap: 20, maxWidth: 480 }}>
      <h1 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 800 }}>⚙️ 設定</h1>

      <form onSubmit={saveProfile} className="holo ac-cyan" style={{ padding: "1.4rem", display: "grid", gap: 14 }}>
        <Corners />
        <div>
          <FieldLabel htmlFor="name">名前</FieldLabel>
          <TextInput id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <FieldLabel htmlFor="password">新しいパスワード(変更する場合のみ)</FieldLabel>
          <TextInput id="password" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <ErrorText>{error}</ErrorText>
        <SuccessText>{done}</SuccessText>
        <button className="btn btn-solid ac-cyan" type="submit" style={{ cursor: "pointer" }}>▸ 保存する</button>
      </form>

      <div className="holo ac-magenta" style={{ padding: "1.4rem" }}>
        <Corners />
        <p style={{ fontSize: "0.88rem", color: "var(--text-dim)", marginBottom: 12 }}>
          いつでも戻ってこられます。退会してもデータは30日間保持され、その間にログインすれば復活できます。
        </p>
        {!confirmDelete ? (
          <button className="btn" onClick={() => setConfirmDelete(true)} style={{ borderColor: "var(--magenta)", color: "var(--magenta)", cursor: "pointer" }}>
            退会する
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-solid" onClick={deactivate} style={{ background: "var(--magenta)", cursor: "pointer" }}>本当に退会する</button>
            <button className="btn" onClick={() => setConfirmDelete(false)} style={{ cursor: "pointer" }}>キャンセル</button>
          </div>
        )}
      </div>
    </div>
  );
}
