import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";
import { computeDaily, toWorkDate } from "@/lib/core";

export default async function DashboardPage() {
  const userId = await requireUserId();
  const today = toWorkDate(new Date());

  const [settings, activeSession, todaySessions, monthlySessions] = await Promise.all([
    prisma.userSettings.findUnique({ where: { userId } }),
    prisma.workSession.findFirst({ where: { userId, clockOut: null }, orderBy: { clockIn: "desc" } }),
    prisma.workSession.findMany({ where: { userId, workDate: today, clockOut: { not: null } }, orderBy: { clockIn: "asc" } }),
    prisma.workSession.findMany({
      where: { userId, workDate: { gte: `${today.slice(0, 8)}01`, lte: `${today.slice(0, 8)}31` }, clockOut: { not: null } }
    })
  ]);

  const regularShiftHours = settings?.regularShiftHours ?? 8;
  const regularRate = settings?.regularHourlyRate ?? 0;
  const otRate = settings?.otHourlyRate ?? 0;
  const todayDurations = todaySessions.map((s) => s.durationMinutes);
  if (activeSession) {
    const liveMinutes = Math.floor((Date.now() - activeSession.clockIn.getTime()) / 60000);
    todayDurations.push(Math.max(0, liveMinutes));
  }
  const daily = computeDaily(todayDurations, regularShiftHours, regularRate, otRate);
  const monthPay = monthlySessions.reduce((sum, s) => sum + (s.durationMinutes / 60) * s.appliedRegularRate, 0);
  const firstArrival = [...todaySessions, ...(activeSession ? [activeSession] : [])].sort(
    (a, b) => a.clockIn.getTime() - b.clockIn.getTime()
  )[0];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="card row">
        <div>
          <h2 style={{ margin: 0 }}>Good day!</h2>
          <small style={{ color: "var(--muted)" }}>
            {firstArrival ? `First arrival: ${firstArrival.clockIn.toLocaleTimeString()}` : "No clock-in yet today"}
          </small>
        </div>
      </div>
      <form action={activeSession ? "/api/sessions/clock-out" : "/api/sessions/clock-in"} method="post">
        <button
          className={`btn ${activeSession ? "btn-danger" : "btn-primary"}`}
          style={{ width: "100%", padding: "18px 16px", fontSize: 18 }}
        >
          {activeSession ? "CLOCK OUT" : "CLOCK IN"}
        </button>
      </form>
      <div className="card">
        <div
          style={{ height: 12, borderRadius: 999, background: "var(--border)", overflow: "hidden", marginBottom: 8 }}
        >
          <div
            style={{
              width: `${Math.min(100, (daily.totalMinutes / (regularShiftHours * 60)) * 100)}%`,
              height: "100%",
              background: daily.otMinutes > 0 ? "#a855f7" : "var(--success)"
            }}
          />
        </div>
        <small style={{ color: "var(--muted)" }}>
          {daily.otMinutes > 0
            ? "You are in overtime."
            : `You have ${Math.max(0, Math.round(regularShiftHours * 60 - daily.totalMinutes))} minutes remaining.`}
        </small>
      </div>
      <Link href="/salary" className="card">
        <p style={{ margin: "0 0 8px" }}>Current Month Earnings</p>
        <h2 style={{ margin: 0 }}>${monthPay.toFixed(2)}</h2>
      </Link>
    </div>
  );
}
