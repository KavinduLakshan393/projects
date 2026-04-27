"use client";

import { useState, useEffect, useCallback } from "react";
import { getTodaySessions, clockIn, clockOut } from "@/app/actions/time";

// Types derived from Prisma without importing PrismaClient on the client
type Session = {
  id: string;
  clockIn: Date;
  clockOut: Date | null;
  regularHours: number | null;
  otHours: number | null;
};

interface Props {
  regularShiftHours: number;
}

function getLocalDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DashboardInteractive({ regularShiftHours }: Props) {
  const [localDate, setLocalDate] = useState("");
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [completedSessions, setCompletedSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeDurationSecs, setActiveDurationSecs] = useState(0);

  // 1. Initialize data based on client's local date
  const loadData = useCallback(async () => {
    setIsLoading(true);
    const dateStr = getLocalDateString();
    setLocalDate(dateStr);
    
    try {
      const data = await getTodaySessions(dateStr);
      setActiveSession(data.activeSession as Session || null);
      setCompletedSessions(data.completedSessions as Session[]);
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 2. Real-time Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeSession && !activeSession.clockOut) {
      // Calculate initial diff
      const startMs = new Date(activeSession.clockIn).getTime();
      
      const updateTimer = () => {
        const nowMs = new Date().getTime();
        setActiveDurationSecs(Math.floor((nowMs - startMs) / 1000));
      };
      
      updateTimer(); // Initial call
      interval = setInterval(updateTimer, 1000);
    } else {
      setActiveDurationSecs(0);
    }
    
    return () => clearInterval(interval);
  }, [activeSession]);

  // 3. Actions
  const handleToggle = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      if (activeSession) {
        // Clock Out
        await clockOut(activeSession.id, localDate);
      } else {
        // Clock In
        await clockIn(localDate);
      }
      await loadData(); // Reload all data to get fresh calculated aggregates
    } catch (err) {
      console.error("Action failed:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Progress Calculations
  const completedHours = completedSessions.reduce((acc, curr) => {
    return acc + (curr.regularHours || 0) + (curr.otHours || 0);
  }, 0);
  
  const activeHours = activeDurationSecs / 3600;
  const totalHoursToday = completedHours + activeHours;
  
  const progressPercent = Math.min((totalHoursToday / regularShiftHours) * 100, 100);
  const isOvertime = totalHoursToday > regularShiftHours;

  // Format HH:MM:SS
  const formatSecs = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-12 bg-muted rounded-xl"></div>
      <div className="h-64 bg-muted rounded-full w-64 mx-auto"></div>
      <div className="h-4 bg-muted rounded-full"></div>
    </div>;
  }

  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* Date Header */}
      <div className="w-full flex justify-between items-center gap-4">
        <h2 className="text-base font-medium text-foreground">
          {new Date(localDate + "T00:00:00").toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </h2>
        {isOvertime && (
          <span className="px-3 py-1 bg-warning/20 text-warning text-xs font-bold rounded-full border border-warning/30">
            OVERTIME
          </span>
        )}
      </div>

      {/* The Big Toggle Button */}
      <button
        onClick={handleToggle}
        disabled={isProcessing}
        className={[
          "relative flex flex-col items-center justify-center w-64 h-64 rounded-full shadow-2xl transition-all duration-300",
          "active:scale-95 disabled:opacity-80 disabled:active:scale-100 outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background",
          activeSession 
            ? "bg-gradient-to-b from-destructive to-[#be123c] text-destructive-foreground shadow-destructive/30" 
            : "bg-gradient-to-b from-success to-[#047857] text-success-foreground shadow-success/30"
        ].join(" ")}
      >
        <div className="absolute inset-2 rounded-full border-2 border-white/20"></div>
        <span className="text-sm font-semibold tracking-widest uppercase opacity-90 mb-2">
          {isProcessing ? "Processing..." : activeSession ? "Clock Out" : "Clock In"}
        </span>
        {activeSession ? (
          <span className="text-4xl font-bold tabular-nums tracking-tight">
            {formatSecs(activeDurationSecs)}
          </span>
        ) : (
          <span className="text-4xl font-bold tracking-tight">Ready</span>
        )}
      </button>

      {/* Progress Bar Area — proper 8px spacing */}
      <div className="w-full space-y-4 glass p-6 rounded-2xl border border-border">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-muted-foreground">Today's Progress</span>
          <span className="tabular-nums text-foreground">{totalHoursToday.toFixed(2)} / {regularShiftHours}h</span>
        </div>
        
        <div className="h-3 w-full bg-surface-elevated rounded-full overflow-hidden border border-border">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${isOvertime ? 'bg-warning' : 'bg-primary'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        {isOvertime && (
          <p className="text-xs text-center text-warning font-medium">
            You are earning overtime pay!
          </p>
        )}
      </div>
    </div>
  );
}
