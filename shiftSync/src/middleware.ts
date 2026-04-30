import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

const PUBLIC_ROUTES = new Set(["/login"]);

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isLoggedIn = Boolean(req.auth?.user);
  const needsOnboarding = Boolean(req.auth?.user?.needsOnboarding);

  const isPublicRoute = PUBLIC_ROUTES.has(pathname);
  const isOnboardingRoute = pathname === "/onboarding";
  const isRootRoute = pathname === "/";

  if (!isLoggedIn) {
    if (isPublicRoute) {
      return NextResponse.next();
    }

    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (needsOnboarding) {
    if (!isOnboardingRoute) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }

    return NextResponse.next();
  }

  if (isPublicRoute || isOnboardingRoute || isRootRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\..*).*)",
  ],
};