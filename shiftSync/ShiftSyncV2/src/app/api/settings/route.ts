import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";
import { SettingsSchema } from "@/lib/core";

export async function POST(request: Request) {
  const userId = await requireUserId();
  const form = await request.formData();
  const parsed = SettingsSchema.safeParse({
    regularShiftHours: Number(form.get("regularShiftHours")),
    regularHourlyRate: Number(form.get("regularHourlyRate")),
    otHourlyRate: Number(form.get("otHourlyRate")),
    themePreference: String(form.get("themePreference") ?? "system")
  });

  if (!parsed.success) {
    return NextResponse.redirect(new URL("/settings", request.url));
  }

  await prisma.userSettings.upsert({
    where: { userId },
    update: parsed.data,
    create: { userId, ...parsed.data }
  });

  const response = NextResponse.redirect(new URL("/settings", request.url));
  response.cookies.set("shiftsync_theme", parsed.data.themePreference, { sameSite: "lax", path: "/" });
  return response;
}
