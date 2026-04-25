"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface TopHeaderProps {
  /** User's Google avatar URL — null when not yet loaded or signed out */
  avatarUrl?: string | null;
  /** User's display name for the bottom sheet */
  userName?: string | null;
  /** User's email for the bottom sheet */
  userEmail?: string | null;
}

/**
 * TopHeader — Sticky glassmorphism header bar.
 *
 * Behaviour:
 *  - Hides (translates up) when the user scrolls DOWN past 60px
 *  - Reveals (translates back) when the user scrolls UP
 *  - Glassmorphism: backdrop-blur + semi-transparent bg (via .glass class)
 *  - Left: ShiftSync typographic logo → navigates to /dashboard
 *  - Right: User avatar → opens an avatar bottom sheet
 */
export function TopHeader({ avatarUrl, userName, userEmail }: TopHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // ── Hide-on-scroll-down / reveal-on-scroll-up ─────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          // Only toggle after 60px to avoid jitter at the very top
          if (currentScrollY < 60) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY.current) {
            setIsVisible(false); // scrolling down
          } else {
            setIsVisible(true); // scrolling up
          }
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Lock body scroll when sheet is open ──────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isSheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSheetOpen]);

  return (
    <>
      {/* ── Header bar ────────────────────────────────────────────────────── */}
      <header
        className={[
          "fixed top-0 left-0 md:left-64 right-0 z-40 h-16",
          "glass border-b border-glass-border",
          "transition-transform duration-300 ease-in-out",
          isVisible ? "translate-y-0" : "-translate-y-full",
        ].join(" ")}
        role="banner"
      >
        <div className="flex h-full items-center justify-between px-4 w-full">
          {/* Left — Logo / Brand (hidden on desktop since it's in sidebar) */}
          <Link
            href="/dashboard"
            className="flex md:hidden items-center gap-2 select-none"
            aria-label="ShiftSync — Go to Dashboard"
          >
            {/* Brand mark (clock icon inline SVG for zero external requests) */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                cx="14"
                cy="14"
                r="12"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-primary"
              />
              <path
                d="M14 8v6l4 2"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              />
            </svg>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Shift<span className="text-primary">Sync</span>
            </span>
          </Link>

          {/* Right — Avatar button */}
          <button
            id="header-avatar-btn"
            onClick={() => setIsSheetOpen(true)}
            className={[
              "relative h-9 w-9 rounded-full overflow-hidden",
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

      {/* ── Avatar Bottom Sheet ───────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
          "transition-opacity duration-300",
          isSheetOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden="true"
        onClick={() => setIsSheetOpen(false)}
      />

      {/* Sheet panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Account menu"
        className={[
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-surface-elevated rounded-t-3xl p-6",
          "border-t border-border",
          "transition-transform duration-300 ease-out",
          isSheetOpen ? "translate-y-0" : "translate-y-full",
          "pb-safe max-w-2xl mx-auto",
        ].join(" ")}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-muted" />

        {/* User info */}
        <div className="mb-6 flex items-center gap-3">
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
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">
              {userName ?? "ShiftSync User"}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {userEmail ?? ""}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150 text-left"
            onClick={() => setIsSheetOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span className="font-medium">Support &amp; Help</span>
          </button>

          {/* Sign out — destructive */}
          <button
            id="sign-out-btn"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors duration-150 text-left font-medium"
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
  );
}
