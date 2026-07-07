import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail, emailEnabled } from "@/lib/email";

export async function POST(req: Request) {
  let body: { email?: string; password?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const name = body.name?.trim() || null;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Graceful degrade (documented adjustment to the spec): without a real
  // RESEND_API_KEY there is no way to actually deliver a verification email,
  // so auto-verify on signup instead of gating access behind an email that
  // can never arrive. Once RESEND_API_KEY is configured, this switches to
  // the real verify-by-link flow automatically.
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      rank: "RANCHER",
      emailVerified: emailEnabled ? null : new Date(),
    },
  });

  await prisma.rankEvent.create({
    data: { userId: user.id, fromRank: "VISITOR", toRank: "RANCHER", reason: "signup" },
  });

  if (emailEnabled) {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h
    await prisma.verificationToken.create({ data: { identifier: email, token, expires } });
    await sendVerificationEmail(email, token);
  }

  return NextResponse.json({ ok: true, verificationRequired: emailEnabled });
}
