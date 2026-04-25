import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Pre-fetch settings to populate the form
  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    redirect("/onboarding");
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pt-6 md:pt-10">
      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Manage your pay rates and application preferences.
        </p>
      </div>

      <SettingsForm 
        initialData={{
          regularShiftHours: settings.regularShiftHours,
          regularHourlyRate: settings.regularHourlyRate,
          otHourlyRate: settings.otHourlyRate,
        }} 
      />
    </div>
  );
}
