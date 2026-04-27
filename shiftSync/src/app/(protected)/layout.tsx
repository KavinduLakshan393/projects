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
    <div className="relative min-h-screen w-full bg-background text-foreground flex overflow-x-hidden">
      {/* Desktop Sidebar — Fixed left side */}
      <Sidebar />

      {/* Main Content Area — Offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative">
        {/* Top Header — Should stay within this flex-1 container */}
        <TopHeader
          avatarUrl={session?.user?.image}
          userName={session?.user?.name}
          userEmail={session?.user?.email}
        />

        {/* Scrollable Page Content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto px-4 md:px-10 py-8 pb-32 md:pb-12"
        >
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
