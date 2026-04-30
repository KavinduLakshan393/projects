import { redirect } from "next/navigation";
import { TopHeader } from "@/components/layout/TopHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { auth } from "@/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground flex overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative">
        <TopHeader
          avatarUrl={session.user.image}
          userName={session.user.name}
          userEmail={session.user.email}
        />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto px-4 md:px-10 py-8 pb-32 md:pb-12"
        >
          <div className="max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}