import { NextResponse } from "next/server";
import { authCookieName } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const userId = process.env.DEMO_USER_ID ?? "demo-user-1";
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: "demo@shiftsync.app",
      name: "Demo Worker"
    }
  });
  await prisma.userSettings.upsert({
    where: { userId },
    update: {},
    create: { userId, regularShiftHours: 8, regularHourlyRate: 20, otHourlyRate: 30 }
  });
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set(authCookieName, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
  return response;
}
