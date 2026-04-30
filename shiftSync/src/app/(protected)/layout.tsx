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
    <div className="min-h-screen bg-background text-foreground md:flex">
      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopHeader
          avatarUrl={session.user.image}
          userName={session.user.name}
          userEmail={session.user.email}
        />

        <main id="main-content" className="flex-1 px-4 pb-28 pt-5 sm:px-6 md:px-8 md:pb-10 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
