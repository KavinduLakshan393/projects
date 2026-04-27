"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * ThemeProvider wraps next-themes' ThemeProvider and sets it up for ShiftSync.
 *
 * - attribute="class"  → adds/removes the "dark" class on <html> (Tailwind v4 style)
 * - defaultTheme="system" → respects OS preference on first visit
 * - enableSystem       → syncs with prefers-color-scheme media query
 * - disableTransitionOnChange is NOT set → we want the smooth CSS transition defined
 *   in globals.css (transition: background-color 0.2s ease, color 0.2s ease)
 */
type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
