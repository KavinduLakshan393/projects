import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";
import { computeDaily } from "@/lib/core";

export default async function SalaryPage({
  searchParams
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const userId = await requireUserId();
  const params = await searchParams;
  const now = new Date();
  const defaultFrom = `${now.toISOString().slice(0, 8)}01`;
  const from = params.from ?? defaultFrom;
  const to = params.to ?? now.toISOString().slice(0, 10);

  const [sessions, settings] = await Promise.all([
    prisma.workSession.findMany({
      where: { userId, workDate: { gte: from, lte: to }, clockOut: { not: null } },
      orderBy: { workDate: "desc" }
    }),
    prisma.userSettings.findUnique({ where: { userId } })
  ]);

  const grouped = sessions.reduce<Record<string, typeof sessions>>((acc, item) => {
    if (!acc[item.workDate]) acc[item.workDate] = [];
    acc[item.workDate].push(item);
    return acc;
  }, {});
  const rows = Object.entries(grouped).map(([date, daySessions]) => {
    const day = computeDaily(
      (daySessions ?? []).map((s) => s.durationMinutes),
      settings?.regularShiftHours ?? 8,
      daySessions?.[0]?.appliedRegularRate ?? settings?.regularHourlyRate ?? 0,
      daySessions?.[0]?.appliedOtRate ?? settings?.otHourlyRate ?? 0
    );
    return { date, total: day.totalPay };
  });

  const total = rows.reduce((sum, row) => sum + row.total, 0);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <form className="card" style={{ display: "grid", gap: 8 }}>
        <label>
          From
          <input className="input" type="date" name="from" defaultValue={from} />
        </label>
        <label>
          To
          <input className="input" type="date" name="to" defaultValue={to} />
        </label>
        <button className="btn btn-primary">Analyze Salary</button>
      </form>
      <div className="card">
        <small style={{ color: "var(--muted)" }}>
          Total Earnings ({from} to {to})
        </small>
        <h2 style={{ margin: "8px 0 0" }}>${total.toFixed(2)}</h2>
      </div>
      <div className="card" style={{ display: "grid", gap: 8 }}>
        {rows.map((row) => (
          <div className="row" key={row.date}>
            <span>{row.date}</span>
            <strong>${row.total.toFixed(2)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
