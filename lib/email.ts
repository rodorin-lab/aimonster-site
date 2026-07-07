// Transactional email — optional (spec adjustment). Without a real
// RESEND_API_KEY, callers should skip email-gated flows entirely (see
// app/api/auth/register/route.ts) rather than pretending mail was sent.
// Once RESEND_API_KEY is set, these functions genuinely send via Resend's
// HTTP API (no SDK dependency needed for a couple of simple templates).

export const emailEnabled = Boolean(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL || "noreply@aimonster-site.com";

async function send(to: string, subject: string, html: string): Promise<void> {
  if (!emailEnabled) return;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  if (!res.ok) {
    console.error("Resend send failed:", res.status, await res.text().catch(() => ""));
  }
}

function siteUrl(): string {
  return process.env.NEXTAUTH_URL || "http://localhost:3020";
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const url = `${siteUrl()}/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  await send(
    email,
    "Verify your AI MONSTER FACTORY account",
    `<p>Welcome to the Ranch.</p><p><a href="${url}">Click here to verify your email</a>. This link expires in 24 hours.</p>`,
  );
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const url = `${siteUrl()}/auth/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  await send(
    email,
    "Reset your AI MONSTER FACTORY password",
    `<p><a href="${url}">Click here to reset your password</a>. This link expires in 1 hour. If you didn't request this, ignore this email.</p>`,
  );
}

export async function sendRankUpEmail(email: string, rankLabel: string): Promise<void> {
  await send(
    email,
    `You're now a ${rankLabel} — AI MONSTER FACTORY`,
    `<p>Your rank just changed to <strong>${rankLabel}</strong>. Thank you for being part of the lab.</p>`,
  );
}
