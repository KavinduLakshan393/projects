"use client";

import { useCallback, useEffect, useState } from "react";
import { clockIn, clockOut, getTodaySessions } from "@/app/actions/time";

type Session = {
  id: string;
  workDate: string;
  clockIn: Date;
  clockOut: Date | null;
  regularHours: number | null;
  otHours: number | null;
  autoClosed?: boolean;
  notes: string | null;
};

interface Props {
  regularShiftHours: number;
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

function formatSecs(totalSecs: number) {
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function normalizeSession(session: Session): Session {
  return {
    ...session,
    autoClosed: Boolean(session.autoClosed),
  };
}

export function DashboardInteractive({ regularShiftHours }: Props) {
  const safeRegularShiftHours = regularShiftHours > 0 ? regularShiftHours : 8;

  const [localDate, setLocalDate] = useState("");
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [completedSessions, setCompletedSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeDurationSecs, setActiveDurationSecs] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    const dateStr = getLocalDateString();
    const timezoneOffsetMinutes = getTimezoneOffsetMinutes();

    setLocalDate(dateStr);

    try {
      const data = await getTodaySessions(dateStr, timezoneOffsetMinutes);
      setActiveSession(data.activeSession ? normalizeSession(data.activeSession) : null);
      setCompletedSessions(data.completedSessions.map(normalizeSession));
    } catch (error) {
      console.error("Failed to load sessions:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load today's sessions."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (activeSession && !activeSession.clockOut) {
      const startMs = new Date(activeSession.clockIn).getTime();

      const updateTimer = () => {
        const nowMs = Date.now();
        setActiveDurationSecs(Math.max(0, Math.floor((nowMs - startMs) / 1000)));
      };

      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setActiveDurationSecs(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeSession]);

  const handleToggle = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const currentWorkDate = getLocalDateString();
      const timezoneOffsetMinutes = getTimezoneOffsetMinutes();

      if (activeSession) {
        await clockOut(activeSession.id, activeSession.workDate, timezoneOffsetMinutes);
      } else {
        await clockIn(currentWorkDate, timezoneOffsetMinutes);
      }

      await loadData();
    } catch (error) {
      console.error("Action failed:", error);
      setErrorMessage(error instanceof Error ? error.message : "Action failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const completedHours = completedSessions.reduce((total, item) => {
    return total + (item.regularHours ?? 0) + (item.otHours ?? 0);
  }, 0);

  const activeHours = activeDurationSecs / 3600;
  const totalHoursToday = completedHours + activeHours;
  const progressPercent = Math.min((totalHoursToday / safeRegularShiftHours) * 100, 100);
  const isOvertime = totalHoursToday > safeRegularShiftHours;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-muted rounded-xl" />
        <div className="h-64 bg-muted rounded-full w-64 mx-auto" />
        <div className="h-4 bg-muted rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col items-center">
      {errorMessage ? (
        <div className="w-full rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <div className="w-full flex justify-between items-center gap-4">
        <h2 className="text-base font-medium text-foreground">
          {localDate
            ? new Date(`${localDate}T00:00:00`).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })
            : "Today"}
        </h2>

        {isOvertime ? (
          <span className="px-3 py-1 bg-warning/20 text-warning text-xs font-bold rounded-full border border-warning/30">
            OVERTIME
          </span>
        ) : null}
      </div>

      <button
        onClick={handleToggle}
        disabled={isProcessing}
        className={[
          "relative flex flex-col items-center justify-center w-72 h-72 rounded-full transition-all duration-500",
          "active:scale-95 disabled:opacity-80 disabled:active:scale-100 outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background group",
          activeSession
            ? "bg-linear-to-br from-rose-500 via-rose-600 to-rose-700 shadow-[0_0_40px_rgba(244,63,94,0.3)]"
            : "bg-linear-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-[0_0_40px_rgba(16,185,129,0.3)]",
        ].join(" ")}
      >
        <div className="absolute inset-2 rounded-full border border-white/20 group-hover:border-white/40 transition-colors" />
        <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-70 mb-3 relative z-10">
          {isProcessing ? "Processing" : activeSession ? "Active Shift" : "Ready to Start"}
        </span>

        {activeSession ? (
          <span className="text-5xl font-black tabular-nums tracking-tighter relative z-10 drop-shadow-md">
            {formatSecs(activeDurationSecs)}
          </span>
        ) : (
          <span className="text-4xl font-black tracking-tighter relative z-10 uppercase drop-shadow-md">
            Clock In
          </span>
        )}
      </button>

      <div className="w-full space-y-5 glass-card p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3">
          <div className="w-2 h-2 rounded-full bg-primary/20 animate-ping" />
        </div>

        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
          <span className="text-muted-foreground">Workday Progress</span>
          <span className="tabular-nums text-primary text-glow">
            {totalHoursToday.toFixed(2)} / {safeRegularShiftHours}h
          </span>
        </div>

        <div className="h-4 w-full bg-black/40 rounded-full p-1 border border-white/5 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-1000 shadow-glow ${
              isOvertime ? "bg-warning" : "bg-primary"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {isOvertime ? (
          <p className="text-[10px] text-center text-warning font-black uppercase tracking-[0.2em] animate-pulse">
            Overtime Protocol Active
          </p>
        ) : null}
      </div>

      {completedSessions.some((item) => item.autoClosed) ? (
        <div className="w-full rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-xs text-warning">
          One previous open shift was automatically closed because it passed its work date.
        </div>
      ) : null}
    </div>
  );
}
