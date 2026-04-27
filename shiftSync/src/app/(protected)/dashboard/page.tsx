import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardInteractive } from "@/components/dashboard/DashboardInteractive";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch settings to pass to the interactive UI
  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    // Fallback if they somehow bypassed middleware
    redirect("/onboarding");
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground uppercase">
          Good morning, {session.user.name?.split(" ")[0] || "User"}!
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base font-medium">
          Let's make today count. <span className="opacity-80">— Progress is quiet, results are loud.</span>
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Clock In/Out Card — spans full on mobile, half on desktop */}
        <div>
          <DashboardInteractive regularShiftHours={settings.regularShiftHours} />
        </div>
        
        {/* Placeholder for future desktop widgets */}
        <div className="hidden md:flex flex-col space-y-6 opacity-40 select-none">
          <div className="glass p-10 rounded-2xl h-80 border border-dashed border-border flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border border-dashed border-border" />
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Recent Activity (Soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
