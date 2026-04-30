"use client";

import { useEffect, useMemo, useState } from "react";
import { getAttendanceHistory } from "@/app/actions/reports";

type Session = {
  id: string;
  clockIn: Date | string;
  clockOut: Date | string | null;
  workDate: string;
  regularHours: number | null;
  otHours: number | null;
  durationMinutes: number;
  autoClosed?: boolean;
};

function formatDate(workDate: string) {
  return new Date(`${workDate}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(value: Date | string | null) {
  if (!value) return "--:--";

  return new Date(value).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatHours(hours: number) {
  return `${hours.toFixed(2)}h`;
}

function normalizeSession(session: Session): Session {
  return {
    ...session,
    autoClosed: Boolean(session.autoClosed),
  };
}

export function AttendanceView() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getAttendanceHistory(50);
        setSessions((data as Session[]).map(normalizeSession));
      } catch (error) {
        console.error(error);
        setErrorMessage(error instanceof Error ? error.message : "Could not load attendance records.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const summary = useMemo(() => {
    return sessions.reduce(
      (total, session) => {
        const regular = session.regularHours ?? 0;
        const overtime = session.otHours ?? 0;

        total.hours += regular + overtime;
        total.overtime += overtime;
        total.autoClosed += session.autoClosed ? 1 : 0;

        return total;
      },
      { hours: 0, overtime: 0, autoClosed: 0 }
    );
  }, [sessions]);

  const handleExportPDF = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {errorMessage ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="app-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Records</p>
          <p className="mt-3 text-3xl font-black text-foreground tabular-nums">{sessions.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">completed sessions</p>
        </div>

        <div className="app-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Total duration</p>
          <p className="mt-3 text-3xl font-black text-foreground tabular-nums">{formatHours(summary.hours)}</p>
          <p className="mt-2 text-sm text-muted-foreground">from recent records</p>
        </div>

        <div className="app-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Overtime</p>
          <p className="mt-3 text-3xl font-black text-foreground tabular-nums">{formatHours(summary.overtime)}</p>
          <p className="mt-2 text-sm text-muted-foreground">{summary.autoClosed} auto-closed</p>
        </div>
      </div>

      <section className="app-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-black text-foreground">Recent attendance</h3>
            <p className="mt-1 text-sm text-muted-foreground">Last 50 completed sessions.</p>
          </div>

          <button
            type="button"
            onClick={handleExportPDF}
            className="print-hide inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover"
          >
            Export PDF
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-bold text-foreground">No attendance records found.</p>
            <p className="mt-1 text-sm text-muted-foreground">Completed shifts will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sessions.map((session) => {
              const regular = session.regularHours ?? 0;
              const overtime = session.otHours ?? 0;
              const total = regular + overtime;

              return (
                <article key={session.id} className="grid gap-4 px-5 py-4 md:grid-cols-[12rem_1fr_auto] md:items-center">
                  <div>
                    <p className="text-sm font-black text-foreground">{formatDate(session.workDate)}</p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">Work date</p>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-foreground">
                        {formatTime(session.clockIn)} – {formatTime(session.clockOut)}
                      </p>
                      {session.autoClosed ? (
                        <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-bold text-warning">
                          Auto-closed
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatHours(regular)} regular · {formatHours(overtime)} overtime
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xl font-black text-primary tabular-nums">{formatHours(total)}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Duration</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
