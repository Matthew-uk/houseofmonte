import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Optimistic gate only: redirects visitors with no session cookie away from
// protected areas. Real authorisation (role checks) happens server-side in
// lib/auth-guards.ts on every admin page, action and route.
const PUBLIC_ACCOUNT_PATHS = [
  "/account/login",
  "/account/register",
  "/account/forgot-password",
  "/account/reset-password",
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_ACCOUNT_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (!getSessionCookie(request)) {
    const login = new URL("/account/login", request.url);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
