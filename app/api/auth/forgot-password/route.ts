import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail, emailEnabled } from "@/lib/email";

export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

  // Always return success regardless of whether the account exists, so
  // this endpoint can't be used to enumerate registered emails.
  if (!emailEnabled) {
    return NextResponse.json({
      ok: true,
      note: "Email sending isn't configured yet, so no email was actually sent. Ask an admin to reset your password directly.",
    });
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (user?.hashedPassword) {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h
    await prisma.verificationToken.create({ data: { identifier: `reset:${email.toLowerCase()}`, token, expires } });
    await sendPasswordResetEmail(email.toLowerCase(), token);
  }

  return NextResponse.json({ ok: true });
}
