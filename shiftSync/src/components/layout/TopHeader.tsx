"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

interface TopHeaderProps {
  avatarUrl?: string | null;
  userName?: string | null;
  userEmail?: string | null;
}

const PAGE_COPY: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Live shift control and today’s progress",
  },
  "/attendance": {
    title: "Attendance",
    subtitle: "Review completed shift records",
  },
  "/salary": {
    title: "Salary",
    subtitle: "Track estimated earnings and overtime",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Manage pay rates and app preferences",
  },
};

function getInitial(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "User";
  return source.charAt(0).toUpperCase();
}

function getPageCopy(pathname: string) {
  const matchedRoute = Object.keys(PAGE_COPY)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname === route || pathname.startsWith(`${route}/`));

  return matchedRoute ? PAGE_COPY[matchedRoute] : PAGE_COPY["/dashboard"];
}

function BrandMark() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2 md:hidden" aria-label="ShiftSync dashboard">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-sm font-black tracking-tight text-foreground">
        Shift<span className="text-primary">Sync</span>
      </span>
    </Link>
  );
}

export function TopHeader({ avatarUrl, userName, userEmail }: TopHeaderProps) {
  const pathname = usePathname();
  const pageCopy = useMemo(() => getPageCopy(pathname), [pathname]);
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = getInitial(userName, userEmail);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-8 lg:px-10">
        <div className="min-w-0">
          <BrandMark />

          <div className="hidden md:block">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {pageCopy.title}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground">
              {pageCopy.subtitle}
            </h1>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface text-sm font-bold text-foreground shadow-sm transition hover:bg-muted"
            aria-label="Open account menu"
            aria-expanded={menuOpen}
          >
            {avatarUrl ? (
              <Image src={avatarUrl} alt={userName || "User avatar"} width={44} height={44} className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </button>

          {menuOpen ? (
            <div className="absolute right-0 top-14 w-72 rounded-3xl border border-border bg-surface p-3 shadow-2xl">
              <div className="rounded-2xl bg-muted/60 p-4">
                <p className="truncate text-sm font-bold text-foreground">{userName || "ShiftSync User"}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{userEmail || "No email available"}</p>
              </div>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="mt-3 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-destructive transition hover:bg-destructive/10"
              >
                Sign out
                <span aria-hidden="true">→</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
