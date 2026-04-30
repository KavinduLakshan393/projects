import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SalaryReportView } from "@/components/salary/SalaryReportView";

export default async function SalaryPage() {
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
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Salary</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Earnings report
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Track estimated pay from completed shifts, including regular hours and overtime.
        </p>
      </section>

      <SalaryReportView currencySymbol={settings.currencySymbol} />
    </div>
  );
}
