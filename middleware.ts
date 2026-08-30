import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "biolink_session";

// Note: only checks that a session cookie is present (edge-safe, no
// node:crypto). Real signature verification happens server-side in the
// pages/API routes via lib/auth's verifySession.
export function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
