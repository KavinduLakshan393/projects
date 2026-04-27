"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface TopHeaderProps {
  /** User's Google avatar URL — null when not yet loaded or signed out */
  avatarUrl?: string | null;
  /** User's display name for the bottom sheet */
  userName?: string | null;
  /** User's email for the bottom sheet */
  userEmail?: string | null;
}

/**
 * TopHeader — Top header bar for the desktop layout.
 *
 * Behaviour:
 *  - Static at the top of the main content flex container
 *  - Glassmorphism: backdrop-blur + semi-transparent bg
 *  - Left: Placeholder for breadcrumbs or title (mobile shows brand)
 *  - Right: User avatar → opens an avatar bottom sheet / dropdown
 */
export function TopHeader({ avatarUrl, userName, userEmail }: TopHeaderProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // ── Lock body scroll when sheet is open ──────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isSheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSheetOpen]);

  return (
    <>
      {/* ── Header bar — Fixed at top ────────────────────────────────────── */}
      <header
        className="relative z-40 h-16 w-full bg-[rgba(120,113,108,0.05)] backdrop-blur border-b border-border flex-shrink-0 sticky top-0 md:top-0"
        role="banner"
      >
        <div className="flex h-full items-center justify-between px-4 md:px-6 w-full max-w-none">
          {/* Left — Breadcrumbs / Brand on mobile */}
          <div className="flex items-center gap-2">
            {/* Show brand on mobile since sidebar is hidden */}
            <Link
              href="/dashboard"
              className="flex md:hidden items-center gap-2 select-none"
              aria-label="ShiftSync — Go to Dashboard"
            >
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
              <span className="text-lg font-bold tracking-tight">
                <span className="text-foreground">SHIFT</span>
                <span className="text-primary">SYNC</span>
              </span>
            </Link>
            
            {/* Desktop placeholder for breadcrumbs/title */}
            <div className="hidden md:block text-muted-foreground font-medium text-sm">
              Dashboard
            </div>
          </div>

          {/* Right — Avatar button */}
          <button
            id="header-avatar-btn"
            onClick={() => setIsSheetOpen(true)}
            className={[
              "relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0",
              "ring-2 ring-primary/40 hover:ring-primary",
              "transition-all duration-200 active:scale-95",
              "focus-visible:ring-2 focus-visible:ring-primary",
            ].join(" ")}
            aria-label="Open account menu"
            aria-haspopup="dialog"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={userName ?? "User avatar"}
                width={36}
                height={36}
                className="object-cover"
              />
            ) : (
              /* Fallback initials avatar */
              <span className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-sm font-semibold">
                {userName?.charAt(0)?.toUpperCase() ?? "?"}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Avatar Bottom Sheet / Dropdown ────────────────────────────────── */}
      {isSheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setIsSheetOpen(false)}
          />

          {/* Sheet panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Account menu"
            className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-16 md:left-auto md:right-6 md:w-80 md:rounded-2xl md:border md:mt-2 z-50 bg-surface rounded-t-3xl md:rounded-t-2xl p-6 border-t border-border md:border-border transition-transform duration-300 ease-out pb-safe max-w-2xl mx-auto shadow-2xl translate-y-0"
          >
        {/* Drag handle (mobile only) */}
        <div className="md:hidden mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />

        {/* User info — 8px spacing grid */}
        <div className="mb-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-primary/30 flex-shrink-0">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={userName ?? "User avatar"}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-lg font-semibold">
                {userName?.charAt(0)?.toUpperCase() ?? "?"}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground truncate text-sm">
              {userName ?? "ShiftSync User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userEmail ?? ""}
            </p>
          </div>
        </div>

        {/* Actions — flex gap for 8px spacing */}
        <div className="flex flex-col gap-2">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-black/5 hover:text-foreground transition-colors duration-150 text-left font-medium text-sm"
            onClick={() => setIsSheetOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>Support &amp; Help</span>
          </button>

          {/* Sign out — destructive */}
          <button
            id="sign-out-btn"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors duration-150 text-left font-medium text-sm"
            onClick={async () => {
              setIsSheetOpen(false);
              const { signOut } = await import("next-auth/react");
              await signOut();
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
          </div>
        </>
      )}
    </>
  );
}
