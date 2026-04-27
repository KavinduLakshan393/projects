"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const tabs = [
  { href: "/dashboard", label: "Home" },
  { href: "/attendance", label: "Attendance" },
  { href: "/salary", label: "Salary" },
  { href: "/settings", label: "Settings" }
];

export default function ShellClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = useMemo(() => {
    if (pathname.startsWith("/attendance")) return "Attendance";
    if (pathname.startsWith("/salary")) return "Salary";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Dashboard";
  }, [pathname]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--border)",
          background: "color-mix(in oklab, var(--bg) 85%, transparent)"
        }}
      >
        <div className="container" style={{ padding: "14px 16px", maxWidth: 640 }}>
          <div className="row">
            <strong>ShiftSync</strong>
            <span style={{ color: "var(--muted)" }}>{title}</span>
          </div>
        </div>
      </header>
      <main className="container">{children}</main>
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: "1px solid var(--border)",
          background: "var(--card)"
        }}
      >
        <div className="container" style={{ padding: "10px 16px", maxWidth: 640 }}>
          <div className="row" style={{ justifyContent: "space-around" }}>
            {tabs.map((tab) => {
              const active = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  style={{
                    color: active ? "var(--primary)" : "var(--muted)",
                    fontWeight: active ? 700 : 500
                  }}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
