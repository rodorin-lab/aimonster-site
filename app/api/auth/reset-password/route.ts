import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, token, password } = (await req.json().catch(() => ({}))) as {
    email?: string; token?: string; password?: string;
  };
  if (!email || !token || !password) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const identifier = `reset:${email.toLowerCase()}`;
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier, token } },
  });
  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { email: email.toLowerCase() }, data: { hashedPassword } });
  await prisma.verificationToken.delete({ where: { identifier_token: { identifier, token } } });

  return NextResponse.json({ ok: true });
}
