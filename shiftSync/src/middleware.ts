import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
const { auth } = NextAuth(authConfig);

import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  // Cast user to any to read our custom JWT claim safely
  const needsOnboarding = (req.auth?.user as any)?.needsOnboarding;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = nextUrl.pathname === "/login";
  const isOnboardingRoute = nextUrl.pathname === "/onboarding";

  // 1. Always allow NextAuth API routes to complete OAuth flow
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // 2. Security intercept: Force new users to complete onboarding
  if (isLoggedIn && needsOnboarding) {
    if (!isOnboardingRoute) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Convenience: Redirect logged-in (fully onboarded) users away from public/onboarding pages
  if (isLoggedIn && !needsOnboarding) {
    if (isOnboardingRoute || isPublicRoute || nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  // 4. Protect all other routes: Redirect unauthenticated users to login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

// Protect all routes except static assets, API routes (except auth), and icons
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
