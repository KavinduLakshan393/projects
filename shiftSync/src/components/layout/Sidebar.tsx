"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ── Nav items definition (matching BottomNav) ─────────────────────────────────
const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Home",
    id: "nav-dashboard",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    activeIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2L2 9.5V21a1 1 0 0 0 1 1h6v-7h6v7h6a1 1 0 0 0 1-1V9.5L12 2Z" />
      </svg>
    ),
  },
  {
    href: "/attendance",
    label: "Attendance",
    id: "nav-attendance",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
    activeIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M5 4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5zm2-2a1 1 0 0 0-1 1v1H5a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4h-1V3a1 1 0 1 0-2 0v1H9V3a1 1 0 0 0-1-1z" />
      </svg>
    ),
  },
  {
    href: "/salary",
    label: "Salary",
    id: "nav-salary",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    activeIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM12 3a2 2 0 0 1 2 2v2H10V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    id: "nav-settings",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    activeIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-1.5 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M10.5 1a1 1 0 0 0-1 1v1.07A8.01 8.01 0 0 0 5.14 5.14L4.22 4.22a1 1 0 0 0-1.41 1.41l.92.92A8.01 8.01 0 0 0 1.07 11H2a1 1 0 0 0 0 2h-.93a8.01 8.01 0 0 0 2.66 4.45l-.92.92a1 1 0 1 0 1.41 1.41l.92-.92A8.01 8.01 0 0 0 9.5 20.93V22a1 1 0 0 0 2 0v-.93a8.01 8.01 0 0 0 4.45-2.66l.92.92a1 1 0 1 0 1.41-1.41l-.92-.92A8.01 8.01 0 0 0 20.93 13H22a1 1 0 0 0 0-2h-.93a8.01 8.01 0 0 0-2.66-4.45l.92-.92a1 1 0 0 0-1.41-1.41l-.92.92A8.01 8.01 0 0 0 13.5 3.07V2a1 1 0 0 0-1-1h-2z" />
      </svg>
    ),
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:fixed md:left-0 md:top-0 md:bottom-0 md:flex md:flex-col md:w-64 md:flex-shrink-0 md:bg-[rgba(120,113,108,0.05)] md:backdrop-blur md:border-r md:border-border md:z-30">
      {/* Brand area — h-16 matches TopHeader height */}
      <div className="h-16 flex items-center justify-center px-6 gap-3 font-bold text-xl tracking-tight border-b border-border">
        <svg
          width="24"
          height="24"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2.5" className="text-primary" />
          <path d="M14 8v6l4 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
        </svg>
        <span className="text-foreground">SHIFT</span><span className="text-primary">SYNC</span>
      </div>

      {/* Navigation — 8px spacing grid */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              id={item.id}
              href={item.href}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="flex-shrink-0">{isActive ? item.activeIcon : item.icon}</span>
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom area — footer copyright */}
      <div className="px-4 py-4 text-xs text-muted-foreground border-t border-border tabular-nums text-center">
        &copy; {new Date().getFullYear()} ShiftSync
      </div>
    </aside>
  );
}
