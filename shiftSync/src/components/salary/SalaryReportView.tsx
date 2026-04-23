"use client";

import { useState, useEffect, useCallback } from "react";
import { getSalaryReport } from "@/app/actions/reports";

type ReportData = {
  totalEarned: number;
  totalRegularHours: number;
  totalOtHours: number;
  dailyBreakdown: { date: string; earned: number; hours: number }[];
};

function getLastNDays(n: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - n + 1);
  
  const format = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  return { start: format(start), end: format(end) };
}

export function SalaryReportView() {
  const [rangeStr, setRangeStr] = useState<"7days" | "30days">("30days");
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const bounds = getLastNDays(rangeStr === "7days" ? 7 : 30);
    try {
      const report = await getSalaryReport(bounds.start, bounds.end);
      setData(report);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [rangeStr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex justify-center mb-6">
        <div className="bg-surface-elevated p-1 rounded-lg border border-border inline-flex">
          <button 
            onClick={() => setRangeStr("7days")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${rangeStr === "7days" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            Last 7 Days
          </button>
          <button 
            onClick={() => setRangeStr("30days")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${rangeStr === "30days" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-2xl w-full"></div>
          <div className="space-y-2 pt-6">
             <div className="h-10 bg-muted rounded-xl w-full"></div>
             <div className="h-10 bg-muted rounded-xl w-full"></div>
          </div>
        </div>
      ) : data ? (
        <>
          {/* Hero Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 shadow-sm relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <p className="text-sm font-medium text-primary mb-1">Total Earnings</p>
            <p className="text-4xl font-bold tabular-nums text-foreground">
              ${data.totalEarned.toFixed(2)}
            </p>
            <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
              <div>
                <span className="block font-medium text-foreground">{data.totalRegularHours.toFixed(1)}h</span>
                Regular
              </div>
              <div>
                <span className="block font-medium text-foreground">{data.totalOtHours.toFixed(1)}h</span>
                Overtime
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-4 pt-4">
            <h3 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
              Daily Breakdown
            </h3>
            {data.dailyBreakdown.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No shifts recorded in this period.</p>
            ) : (
              <div className="space-y-2">
                {data.dailyBreakdown.map((day) => {
                   const displayDate = new Date(day.date + "T00:00:00").toLocaleDateString(undefined, {
                     weekday: 'short', month: 'short', day: 'numeric'
                   });
                   return (
                    <div key={day.date} className="flex justify-between items-center py-3 border-b border-border/50">
                      <div>
                        <span className="text-foreground font-medium block">{displayDate}</span>
                        <span className="text-xs text-muted-foreground">{day.hours.toFixed(1)}h</span>
                      </div>
                      <span className="font-semibold tabular-nums text-foreground">${day.earned.toFixed(2)}</span>
                    </div>
                   );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-muted-foreground">Error loading data.</p>
      )}
    </div>
  );
}
