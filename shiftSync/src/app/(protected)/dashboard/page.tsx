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
    <div className="p-4 max-w-md mx-auto pt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Good morning, {session.user.name?.split(" ")[0] || "User"}!
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Let's make today count.
        </p>
      </div>

      <DashboardInteractive regularShiftHours={settings.regularShiftHours} />
    </div>
  );
}
