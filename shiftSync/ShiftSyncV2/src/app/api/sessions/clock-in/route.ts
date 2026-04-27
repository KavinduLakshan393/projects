import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";
import { toWorkDate } from "@/lib/core";

export async function POST(request: Request) {
  const userId = await requireUserId();
  const form = await request.formData();
  const timestamp = form.get("timestampIso")?.toString() ?? new Date().toISOString();
  const clockIn = new Date(timestamp);

  const active = await prisma.workSession.findFirst({ where: { userId, clockOut: null } });
  if (active) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  await prisma.workSession.create({
    data: {
      userId,
      workDate: toWorkDate(clockIn),
      clockIn,
      entryMethod: "live"
    }
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
