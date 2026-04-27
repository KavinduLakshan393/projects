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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground uppercase">Settings</h1>
        <p className="text-muted-foreground text-sm md:text-base mt-3 font-medium">
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
