"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { clockIn, clockOut, getTodaySessions } from "@/app/actions/time";

type Session = {
  id: string;
  workDate: string;
  clockIn: Date | string;
  clockOut: Date | string | null;
  durationMinutes: number;
  regularHours: number | null;
  otHours: number | null;
  totalEarned: number | null;
  appliedRegularRate: number;
  appliedOtRate: number;
  autoClosed?: boolean;
  notes: string | null;
};

interface DashboardInteractiveProps {
  regularShiftHours: number;
  regularHourlyRate: number;
  otHourlyRate: number;
  currencySymbol: string;
}

function getLocalDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTimezoneOffsetMinutes() {
  return new Date().getTimezoneOffset();
}

function formatDateLabel(workDate: string) {
  return new Date(`${workDate}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
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

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatHours(hours: number) {
  return `${hours.toFixed(2)}h`;
}

function formatMoney(amount: number, symbol: string) {
  return `${symbol}${amount.toFixed(2)}`;
}

function normalizeSession(session: Session): Session {
  return {
    ...session,
    autoClosed: Boolean(session.autoClosed),
  };
}

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="app-card p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-foreground tabular-nums">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{note}</p>
    </div>
  );
}

export function DashboardInteractive({
  regularShiftHours,
  regularHourlyRate,
  otHourlyRate,
  currencySymbol,
}: DashboardInteractiveProps) {
  const [localDate, setLocalDate] = useState("");
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [completedSessions, setCompletedSessions] = useState<Session[]>([]);
  const [activeDurationSecs, setActiveDurationSecs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const safeRegularShiftHours = Number.isFinite(regularShiftHours) && regularShiftHours > 0 ? regularShiftHours : 8;

  const loadSessions = useCallback(async () => {
    const today = getLocalDateString();
    setLocalDate(today);
    setErrorMessage("");

    try {
      const data = await getTodaySessions(today, getTimezoneOffsetMinutes());
      setActiveSession(data.activeSession ? normalizeSession(data.activeSession as Session) : null);
      setCompletedSessions((data.completedSessions as Session[]).map(normalizeSession));
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Could not load today’s sessions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (!activeSession) {
      setActiveDurationSecs(0);
      return;
    }

    const updateTimer = () => {
      const elapsed = Math.max(
        0,
        Math.floor((Date.now() - new Date(activeSession.clockIn).getTime()) / 1000)
      );
      setActiveDurationSecs(elapsed);
    };

    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(interval);
  }, [activeSession]);

  const metrics = useMemo(() => {
    const completedRegularHours = completedSessions.reduce((total, session) => total + (session.regularHours ?? 0), 0);
    const completedOtHours = completedSessions.reduce((total, session) => total + (session.otHours ?? 0), 0);
    const completedEarned = completedSessions.reduce((total, session) => total + (session.totalEarned ?? 0), 0);

    const activeHours = activeSession ? activeDurationSecs / 3600 : 0;
    const completedHours = completedRegularHours + completedOtHours;
    const activeRegularRemaining = Math.max(0, safeRegularShiftHours - completedHours);
    const activeRegularHours = Math.min(activeHours, activeRegularRemaining);
    const activeOtHours = Math.max(0, activeHours - activeRegularHours);

    const totalRegularHours = completedRegularHours + activeRegularHours;
    const totalOtHours = completedOtHours + activeOtHours;
    const totalHours = totalRegularHours + totalOtHours;
    const estimatedEarned = completedEarned + activeRegularHours * regularHourlyRate + activeOtHours * otHourlyRate;

    return {
      totalHours,
      totalRegularHours,
      totalOtHours,
      estimatedEarned,
      progressPercent: Math.min(100, (totalHours / safeRegularShiftHours) * 100),
      isOvertime: totalHours >= safeRegularShiftHours,
    };
  }, [activeDurationSecs, activeSession, completedSessions, otHourlyRate, regularHourlyRate, safeRegularShiftHours]);

  const handleToggleShift = async () => {
    const today = getLocalDateString();

    try {
      setIsProcessing(true);
      setErrorMessage("");

      if (activeSession) {
        await clockOut(activeSession.id, activeSession.workDate, getTimezoneOffsetMinutes());
      } else {
        await clockIn(today, getTimezoneOffsetMinutes());
      }

      await loadSessions();
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Shift action failed. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const autoClosedSessions = completedSessions.filter((session) => session.autoClosed);

  if (isLoading) {
    return (
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="h-96 animate-pulse rounded-[2rem] bg-muted" />
        <div className="h-96 animate-pulse rounded-[2rem] bg-muted" />
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

      {autoClosedSessions.length > 0 ? (
        <div className="rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm font-medium text-warning">
          {autoClosedSessions.length} previous shift{autoClosedSessions.length === 1 ? "" : "s"} were auto-closed because they were left active after the work date ended.
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="app-card p-5 md:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {localDate ? formatDateLabel(localDate) : "Today"}
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {activeSession ? "Shift in progress" : "Ready to clock in"}
              </h3>
            </div>

            <span
              className={[
                "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]",
                activeSession
                  ? "bg-success/10 text-success ring-1 ring-success/30"
                  : "bg-muted text-muted-foreground ring-1 ring-border",
              ].join(" ")}
            >
              {activeSession ? "Active" : "Off duty"}
            </span>
          </div>

          <div className="mt-8 rounded-[2rem] border border-border bg-muted/35 p-5 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
                  {activeSession ? "Current shift timer" : "No active timer"}
                </p>
                <p className="mt-4 text-5xl font-black tracking-tight text-foreground tabular-nums sm:text-6xl">
                  {activeSession ? formatDuration(activeDurationSecs) : "00:00:00"}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {activeSession
                    ? `Started at ${formatTime(activeSession.clockIn)}`
                    : "Tap clock in when your work starts."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleShift}
                disabled={isProcessing}
                className={[
                  "inline-flex min-h-14 items-center justify-center rounded-2xl px-7 text-sm font-black uppercase tracking-[0.16em] text-white shadow-sm transition active:scale-[0.99] disabled:opacity-70",
                  activeSession
                    ? "bg-destructive hover:bg-destructive/90"
                    : "bg-success hover:bg-success/90",
                ].join(" ")}
              >
                {isProcessing ? "Processing..." : activeSession ? "Clock out" : "Clock in"}
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">Regular shift progress</span>
              <span className="font-bold text-primary tabular-nums">
                {formatHours(metrics.totalHours)} / {formatHours(safeRegularShiftHours)}
              </span>
            </div>

            <div className="h-3 rounded-full bg-muted p-0.5">
              <div
                className={[
                  "h-full rounded-full transition-all duration-700",
                  metrics.isOvertime ? "bg-warning" : "bg-primary",
                ].join(" ")}
                style={{ width: `${metrics.progressPercent}%` }}
              />
            </div>

            <p className={["text-sm", metrics.isOvertime ? "font-medium text-warning" : "text-muted-foreground"].join(" ")}>
              {metrics.isOvertime
                ? "Overtime has started for today."
                : `${formatHours(Math.max(0, safeRegularShiftHours - metrics.totalHours))} remaining before overtime.`}
            </p>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
          <StatCard
            label="Today hours"
            value={formatHours(metrics.totalHours)}
            note={`${completedSessions.length} completed session${completedSessions.length === 1 ? "" : "s"}`}
          />
          <StatCard
            label="Estimated pay"
            value={formatMoney(metrics.estimatedEarned, currencySymbol)}
            note="Includes active shift estimate"
          />
          <StatCard
            label="Overtime"
            value={formatHours(metrics.totalOtHours)}
            note={metrics.isOvertime ? "Currently earning OT" : "No overtime yet"}
          />
        </section>
      </div>

      <section className="app-card p-5 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black tracking-tight text-foreground">Today&apos;s completed sessions</h3>
            <p className="mt-1 text-sm text-muted-foreground">Completed clock-in and clock-out records for this work date.</p>
          </div>
        </div>

        {completedSessions.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
            <p className="font-semibold text-foreground">No completed sessions yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">Your completed shifts will appear here after clock out.</p>
          </div>
        ) : (
          <div className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {completedSessions.map((session) => {
              const hours = (session.regularHours ?? 0) + (session.otHours ?? 0);

              return (
                <div key={session.id} className="grid gap-3 bg-surface px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
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
                      {formatHours(hours)} total · {formatHours(session.regularHours ?? 0)} regular · {formatHours(session.otHours ?? 0)} overtime
                    </p>
                  </div>

                  <p className="text-lg font-black text-foreground tabular-nums">
                    {formatMoney(session.totalEarned ?? 0, currencySymbol)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
