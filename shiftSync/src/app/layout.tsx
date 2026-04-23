import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

// ── Inter font — variable mode so Tailwind's --font-sans picks it up ──────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "ShiftSync — Track Your Time. Know Your Worth.",
    template: "%s | ShiftSync",
  },
  description:
    "ShiftSync is a mobile-first worker attendance and salary tracker. Log split shifts, view real-time earnings, and export professional PDF reports — all from your phone.",
  keywords: [
    "shift tracker",
    "attendance app",
    "salary calculator",
    "work log",
    "overtime calculator",
    "split shift",
  ],
  authors: [{ name: "ShiftSync" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ShiftSync",
  },
};

// ── Viewport / PWA ─────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d1a" },
  ],
};

// ── Root Layout ────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning // next-themes needs this to prevent flicker
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
