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
    <div className="p-4 md:p-8 max-w-5xl mx-auto pt-6 md:pt-10">
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">
          Good morning, {session.user.name?.split(" ")[0] || "User"}!
        </h1>
        <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
          Let's make today count.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:gap-12 items-center justify-center">
        <div className="w-full max-w-md">
          <DashboardInteractive regularShiftHours={settings.regularShiftHours} />
        </div>
        
        {/* Placeholder for future desktop widgets (e.g. recent activity, stats) */}
        <div className="hidden md:flex flex-col w-full max-w-md space-y-6 mt-12 md:mt-0 opacity-50 select-none">
           <div className="glass p-6 rounded-3xl h-64 border border-dashed border-muted-foreground/30 flex items-center justify-center">
             <p className="text-muted-foreground font-medium">Recent Activity (Coming Soon)</p>
           </div>
        </div>
      </div>
    </div>
  );
}
