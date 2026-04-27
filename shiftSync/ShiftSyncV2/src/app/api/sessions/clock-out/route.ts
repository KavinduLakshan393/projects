import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";
import { minutesBetween } from "@/lib/core";

export async function POST(request: Request) {
  const userId = await requireUserId();
  const form = await request.formData();
  const timestamp = form.get("timestampIso")?.toString() ?? new Date().toISOString();
  const clockOut = new Date(timestamp);
  const [active, settings] = await Promise.all([
    prisma.workSession.findFirst({ where: { userId, clockOut: null }, orderBy: { clockIn: "desc" } }),
    prisma.userSettings.findUnique({ where: { userId } })
  ]);

  if (!active || clockOut <= active.clockIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  await prisma.workSession.update({
    where: { id: active.id },
    data: {
      clockOut,
      durationMinutes: minutesBetween(active.clockIn, clockOut),
      appliedRegularRate: settings?.regularHourlyRate ?? 0,
      appliedOtRate: settings?.otHourlyRate ?? 0
    }
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
