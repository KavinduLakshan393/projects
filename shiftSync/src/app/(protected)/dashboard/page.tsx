import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardInteractive } from "@/components/dashboard/DashboardInteractive";

function getFirstName(name?: string | null) {
  return name?.trim().split(/\s+/)[0] || "there";
}

export default async function DashboardPage() {
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
      <section className="app-card overflow-hidden p-5 md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Live shift control
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Good day, {getFirstName(session.user.name)}.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Clock in, track today&apos;s hours, monitor overtime, and keep your work records clean before you leave.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[28rem]">
            <div className="app-card-muted p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Regular day</p>
              <p className="mt-2 text-2xl font-black tabular-nums text-foreground">
                {settings.regularShiftHours.toFixed(1)}h
              </p>
            </div>

            <div className="app-card-muted p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Base rate</p>
              <p className="mt-2 text-2xl font-black tabular-nums text-foreground">
                {settings.currencySymbol}{settings.regularHourlyRate.toFixed(2)}
              </p>
            </div>

            <div className="app-card-muted p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">OT rate</p>
              <p className="mt-2 text-2xl font-black tabular-nums text-foreground">
                {settings.currencySymbol}{settings.otHourlyRate.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <DashboardInteractive
        regularShiftHours={settings.regularShiftHours}
        regularHourlyRate={settings.regularHourlyRate}
        otHourlyRate={settings.otHourlyRate}
        currencySymbol={settings.currencySymbol}
      />
    </div>
  );
}
