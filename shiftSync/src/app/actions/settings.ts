"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function readNumber(formData: FormData, name: string, label: string) {
  const rawValue = formData.get(name);
  const value = typeof rawValue === "string" ? Number(rawValue) : Number.NaN;

  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return value;
}

export async function updateSettings(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const regularShiftHours = readNumber(
    formData,
    "regularShiftHours",
    "Regular shift hours"
  );
  const regularHourlyRate = readNumber(
    formData,
    "regularHourlyRate",
    "Regular hourly rate"
  );
  const otHourlyRate = readNumber(formData, "otHourlyRate", "Overtime hourly rate");

  if (regularShiftHours <= 0 || regularShiftHours > 24) {
    throw new Error("Regular shift hours must be greater than 0 and no more than 24.");
  }

  if (regularHourlyRate < 0 || otHourlyRate < 0) {
    throw new Error("Hourly rates cannot be negative.");
  }

  await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    update: {
      regularShiftHours,
      regularHourlyRate,
      otHourlyRate,
    },
    create: {
      userId: session.user.id,
      regularShiftHours,
      regularHourlyRate,
      otHourlyRate,
      themePreference: "system",
      currencySymbol: "$",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  revalidatePath("/salary");

  return { success: true };
}