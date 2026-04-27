import { NextRequest, NextResponse } from "next/server";
import { authCookieName } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/attendance", "/salary", "/settings"];

export function middleware(request: NextRequest) {
  const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  const uid = request.cookies.get(authCookieName)?.value;

  if (isProtected && !uid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname === "/login" && uid) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/attendance/:path*", "/salary/:path*", "/settings/:path*", "/login"]
};
