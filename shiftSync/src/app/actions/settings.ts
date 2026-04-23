"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const regularShiftHours = parseFloat(formData.get("regularShiftHours") as string);
  const regularHourlyRate = parseFloat(formData.get("regularHourlyRate") as string);
  const otHourlyRate = parseFloat(formData.get("otHourlyRate") as string);

  if (isNaN(regularShiftHours) || isNaN(regularHourlyRate) || isNaN(otHourlyRate)) {
    throw new Error("Invalid number formats provided.");
  }

  await prisma.userSettings.update({
    where: { userId: session.user.id },
    data: {
      regularShiftHours,
      regularHourlyRate,
      otHourlyRate,
    },
  });

  // Revalidate the dashboard and settings pages to ensure new thresholds are used
  revalidatePath("/dashboard");
  revalidatePath("/settings");

  return { success: true };
}
