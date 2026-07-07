import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { name, password } = (await req.json().catch(() => ({}))) as { name?: string; password?: string };
  if (password && password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name?.trim() || null,
      ...(password ? { hashedPassword: await bcrypt.hash(password, 12) } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}

// Soft-deactivate (spec Part 11.5 — "you can always come back"): mark the
// account with a deactivatedAt-style flag by prefixing the email so it
// frees up the address, without destroying the row. Real deletion after
// 30 days would be a scheduled job outside this app's scope for now.
export async function DELETE() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
  if (user.email.startsWith("deactivated:")) {
    return NextResponse.json({ ok: true }); // already deactivated
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { email: `deactivated:${Date.now()}:${user.email}` },
  });

  return NextResponse.json({ ok: true });
}
