import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";
import { computeDaily } from "@/lib/core";

export default async function AttendancePage() {
  const userId = await requireUserId();
  const [sessions, settings] = await Promise.all([
    prisma.workSession.findMany({ where: { userId, clockOut: { not: null } }, orderBy: { workDate: "desc" } }),
    prisma.userSettings.findUnique({ where: { userId } })
  ]);

  const grouped = sessions.reduce<Record<string, typeof sessions>>((acc, item) => {
    if (!acc[item.workDate]) acc[item.workDate] = [];
    acc[item.workDate].push(item);
    return acc;
  }, {});
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <form action="/api/reports/pdf" method="post">
        <button className="btn btn-primary" style={{ width: "100%" }}>
          Export PDF Report
        </button>
      </form>
      {dates.map((date) => {
        const daySessions = grouped[date] ?? [];
        const day = computeDaily(
          daySessions.map((s) => s.durationMinutes),
          settings?.regularShiftHours ?? 8,
          daySessions[0]?.appliedRegularRate ?? settings?.regularHourlyRate ?? 0,
          daySessions[0]?.appliedOtRate ?? settings?.otHourlyRate ?? 0
        );
        return (
          <details key={date} className="card">
            <summary className="row" style={{ cursor: "pointer" }}>
              <strong>{date}</strong>
              <span>{(day.totalMinutes / 60).toFixed(2)} hrs</span>
            </summary>
            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              {daySessions.map((session) => (
                <div className="row" key={session.id}>
                  <small>
                    {session.clockIn.toLocaleTimeString()} - {session.clockOut?.toLocaleTimeString()}
                  </small>
                  <small>{session.durationMinutes}m</small>
                </div>
              ))}
              <hr style={{ borderColor: "var(--border)" }} />
              <small>
                Regular: {(day.regularMinutes / 60).toFixed(2)}h (${day.regularPay.toFixed(2)})
              </small>
              <small>
                OT: {(day.otMinutes / 60).toFixed(2)}h (${day.otPay.toFixed(2)})
              </small>
              <strong>Total: ${day.totalPay.toFixed(2)}</strong>
            </div>
          </details>
        );
      })}
    </div>
  );
}
