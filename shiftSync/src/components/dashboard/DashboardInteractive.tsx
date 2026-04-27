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
          "relative flex flex-col items-center justify-center w-72 h-72 rounded-full transition-all duration-500",
          "active:scale-95 disabled:opacity-80 disabled:active:scale-100 outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background group",
          activeSession 
            ? "bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 shadow-[0_0_40px_rgba(244,63,94,0.3)]" 
            : "bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
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

      {/* Progress Bar Area — proper 8px spacing */}
      <div className="w-full space-y-5 glass-card p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3">
          <div className="w-2 h-2 rounded-full bg-primary/20 animate-ping" />
        </div>

        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
          <span className="text-muted-foreground">Workday Progress</span>
          <span className="tabular-nums text-primary text-glow">{totalHoursToday.toFixed(2)} / {regularShiftHours}h</span>
        </div>
        
        <div className="h-4 w-full bg-black/40 rounded-full p-1 border border-white/5 shadow-inner">
          <div 
            className={`h-full rounded-full transition-all duration-1000 shadow-glow ${isOvertime ? 'bg-warning' : 'bg-primary'}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        {isOvertime && (
          <p className="text-[10px] text-center text-warning font-black uppercase tracking-[0.2em] animate-pulse">
            Overtime Protocol Active
          </p>
        )}
      </div>
    </div>
  );
}
