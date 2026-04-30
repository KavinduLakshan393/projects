"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Clock in and track today",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    href: "/attendance",
    label: "Attendance",
    description: "Completed shift records",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="m9 16 2 2 4-5" />
      </svg>
    ),
  },
  {
    href: "/salary",
    label: "Salary",
    description: "Earnings and overtime",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="3" />
        <circle cx="12" cy="12" r="2" />
        <path d="M7 12h.01M17 12h.01" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Rates and preferences",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.05.05a2 2 0 0 1-2.83 2.83l-.05-.05A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.05a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.05.05a2 2 0 0 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.05A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.05-.05a2 2 0 0 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.05a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.05-.05a2 2 0 0 1 2.83 2.83l-.05.05A1.7 1.7 0 0 0 19.4 9c.22.63.81 1 1.47 1H21a2 2 0 0 1 0 4h-.13a1.7 1.7 0 0 0-1.47 1Z" />
      </svg>
    ),
  },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-border bg-surface md:sticky md:top-0 md:flex md:flex-col">
      <div className="flex h-full flex-col p-5">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-2xl px-2 py-2" aria-label="ShiftSync dashboard">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className="text-base font-black tracking-tight text-foreground">ShiftSync</p>
            <p className="text-xs font-medium text-muted-foreground">Time and earnings tracker</p>
          </div>
        </Link>

        <nav className="mt-8 space-y-2" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "group flex items-center gap-3 rounded-2xl px-3 py-3 transition",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
                    active
                      ? "bg-white/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-surface group-hover:text-foreground",
                  ].join(" ")}
                >
                  {item.icon}
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-bold leading-5">{item.label}</span>
                  <span className={["block truncate text-xs", active ? "text-primary-foreground/75" : "text-muted-foreground"].join(" ")}>
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl border border-border bg-muted/45 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Today tip</p>
          <p className="mt-2 text-sm leading-6 text-foreground">
            Always clock out before leaving. Forgotten shifts are auto-closed, but manual accuracy is better.
          </p>
        </div>

        <p className="mt-4 px-2 text-xs text-muted-foreground">© 2026 ShiftSync · v2.1</p>
      </div>
    </aside>
  );
}
