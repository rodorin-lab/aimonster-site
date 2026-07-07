import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const base = process.env.NEXTAUTH_URL || new URL(req.url).origin;

  if (!email || !token) {
    return NextResponse.redirect(`${base}/auth/signin?verified=0`);
  }

  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email.toLowerCase(), token } },
  });
  if (!record || record.expires < new Date()) {
    return NextResponse.redirect(`${base}/auth/signin?verified=0`);
  }

  await prisma.user.update({ where: { email: email.toLowerCase() }, data: { emailVerified: new Date() } });
  await prisma.verificationToken.delete({ where: { identifier_token: { identifier: email.toLowerCase(), token } } });

  return NextResponse.redirect(`${base}/auth/signin?verified=1`);
}
