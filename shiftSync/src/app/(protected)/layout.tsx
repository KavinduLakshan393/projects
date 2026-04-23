import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { auth } from "@/auth";

/**
 * Protected Layout — wraps all authenticated pages with the App Shell.
 *
 * Structure:
 *   <TopHeader />           ← Fixed, z-40, 64px tall
 *   <main>                  ← Scrollable content area
 *     pt-16                 ← Clears the fixed TopHeader
 *     pb-24                 ← Clears the fixed BottomNav (56px + safe-area)
 *     {children}
 *   </main>
 *   <BottomNav />           ← Fixed, z-40, 56px + safe-area
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
    <div className="relative min-h-screen bg-background">
      {/* Sticky top header */}
      <TopHeader
        avatarUrl={session?.user?.image}
        userName={session?.user?.name}
        userEmail={session?.user?.email}
      />

      {/* Main scrollable content */}
      <main
        id="main-content"
        className="pt-16 pb-24 min-h-screen"
        // pt-16 = 64px header clearance
        // pb-24 = 96px: 56px nav + 40px extra for safe-area on iOS
      >
        {children}
      </main>

      {/* Sticky bottom navigation */}
      <BottomNav />
    </div>
  );
}
