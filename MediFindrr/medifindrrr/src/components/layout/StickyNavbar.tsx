import React from 'react';

interface StickyNavbarProps {
  logoText?: string;
  interactionCheckerHref?: string;
  onSearchClick?: () => void;
  onProfileClick?: () => void;
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function StickyNavbar({
  logoText = 'MediFind',
  interactionCheckerHref = '/interaction-checker',
  onSearchClick,
  onProfileClick,
}: StickyNavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="text-lg font-bold tracking-tight text-slate-900">
          {logoText}
        </a>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={onSearchClick}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Open search"
          >
            <SearchIcon />
          </button>

          <a
            href={interactionCheckerHref}
            className="hidden text-sm font-medium text-slate-700 transition hover:text-[#2563EB] sm:inline"
          >
            Interaction Checker
          </a>

          <button
            type="button"
            onClick={onProfileClick}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Open profile"
          >
            <UserIcon />
          </button>
        </div>
      </nav>
    </header>
  );
}