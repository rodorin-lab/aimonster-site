import { NextResponse, type NextRequest } from "next/server";

// Lightweight edge-safe gate: redirect anonymous visitors away from
// /membership before any page code runs. The actual membership layout
// (requireUser, Node.js runtime) is the authoritative check.
const SESSION_COOKIE_NAMES = ["authjs.session-token", "__Secure-authjs.session-token"];

export function middleware(req: NextRequest) {
  const hasSession = SESSION_COOKIE_NAMES.some((name) => req.cookies.has(name));
  if (!hasSession) {
    const url = new URL("/auth/signin", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/membership/:path*"],
};
