"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Creates the UserSettings row for a newly onboarded user.
 */
export async function submitOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const regularShiftHours = parseFloat(formData.get("regularShiftHours") as string) || 8.0;
  const regularHourlyRate = parseFloat(formData.get("regularHourlyRate") as string) || 0.0;
  const otHourlyRate = parseFloat(formData.get("otHourlyRate") as string) || 0.0;

  // Create UserSettings in the database
  await prisma.userSettings.create({
    data: {
      userId: session.user.id,
      regularShiftHours,
      regularHourlyRate,
      otHourlyRate,
      themePreference: "system",
      currencySymbol: "$",
    },
  });

  return { success: true };
}
