import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    redirect("/onboarding");
  }

  return (
    <div className="space-y-6">
      <section className="app-card p-5 md:p-7">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Settings</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Pay and preferences
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Update your regular shift hours, hourly rates, and interface theme.
        </p>
      </section>

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
