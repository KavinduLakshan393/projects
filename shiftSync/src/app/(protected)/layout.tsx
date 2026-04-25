import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { auth } from "@/auth";

/**
 * Protected Layout — wraps all authenticated pages with the App Shell.
 *
 * Structure:
 *   <Sidebar />             ← Fixed, left side, desktop only (256px wide)
 *   <TopHeader />           ← Fixed, top, adjusts width on desktop
 *   <main>                  ← Scrollable content area
 *     Mobile: pt-16, pb-24
 *     Desktop: md:pl-64, md:pt-20, md:pb-8
 *     {children}
 *   </main>
 *   <BottomNav />           ← Fixed, bottom, mobile only
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
    <div className="relative min-h-screen bg-background flex">
      {/* Sidebar (Desktop only) */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky top header */}
        <TopHeader
          avatarUrl={session?.user?.image}
          userName={session?.user?.name}
          userEmail={session?.user?.email}
        />

        {/* Main scrollable content */}
        <main
          id="main-content"
          className="pt-16 pb-24 md:pl-64 md:pt-20 md:pb-8 min-h-screen"
        >
          {children}
        </main>

        {/* Sticky bottom navigation (Mobile only) */}
        <BottomNav />
      </div>
    </div>
  );
}
