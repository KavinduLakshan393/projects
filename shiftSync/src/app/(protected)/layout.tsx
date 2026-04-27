import { TopHeader } from "@/components/layout/TopHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { auth } from "@/auth";

/**
 * Protected Layout — wraps all authenticated pages with the App Shell.
 *
 * Desktop structure:
 *   <Sidebar />             ← Fixed left side (w-64 fixed inset-y-0)
 *   <main>                  ← Main content area (flex-1)
 *     <TopHeader />         ← Fixed top (h-16 sticky top-0)
 *     <Scrollable Content>  ← overflow-y-auto, proper padding to avoid overlaps
 *
 * Mobile structure:
 *   <main>                  ← Full width
 *     <TopHeader />         ← Fixed top (h-16 sticky top-0)
 *     <Scrollable Content>  ← overflow-y-auto, pb-20 to avoid BottomNav overlap
 *     <BottomNav />         ← Fixed bottom (h-16 fixed bottom-0)
 *
 * NOTE: Session is fetched securely on the server using NextAuth v5 `auth()`.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar — Fixed left side */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-0">
        {/* Top Header — Fixed/Sticky at top */}
        <TopHeader
          avatarUrl={session?.user?.image}
          userName={session?.user?.name}
          userEmail={session?.user?.email}
        />

        {/* Scrollable Page Content — Prevent overlaps */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
        >
          <div className="max-w-5xl mx-auto w-full px-4 md:px-6 py-6 md:py-8 pb-20 md:pb-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
