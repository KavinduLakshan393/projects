"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSalaryReport } from "@/app/actions/reports";

type RangeKey = "7days" | "30days" | "90days";

type ReportData = {
  totalEarned: number;
  totalRegularHours: number;
  totalOtHours: number;
  dailyBreakdown: { date: string; earned: number; hours: number }[];
};

interface SalaryReportViewProps {
  currencySymbol: string;
}

const RANGES: Record<RangeKey, { label: string; days: number }> = {
  "7days": { label: "7 days", days: 7 },
  "30days": { label: "30 days", days: 30 },
  "90days": { label: "90 days", days: 90 },
};

function getLastNDays(n: number) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - n + 1);

  const format = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return { start: format(start), end: format(end) };
}

function formatDate(workDate: string) {
  return new Date(`${workDate}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatMoney(amount: number, symbol: string) {
  return `${symbol}${amount.toFixed(2)}`;
}

function formatHours(hours: number) {
  return `${hours.toFixed(2)}h`;
}

function SummaryCard({
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
      <p className="mt-3 text-3xl font-black text-foreground tabular-nums">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{note}</p>
    </div>
  );
}

export function SalaryReportView({ currencySymbol }: SalaryReportViewProps) {
  const [rangeKey, setRangeKey] = useState<RangeKey>("30days");
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedRange = RANGES[rangeKey];

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    const bounds = getLastNDays(selectedRange.days);

    try {
      const report = await getSalaryReport(bounds.start, bounds.end);
      setData(report);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Could not load salary report.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedRange.days]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const averagePerDay = useMemo(() => {
    if (!data || data.dailyBreakdown.length === 0) return 0;
    return data.totalEarned / data.dailyBreakdown.length;
  }, [data]);

  return (
    <div className="space-y-5">
      <section className="app-card p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-black text-foreground">Report range</h3>
            <p className="mt-1 text-sm text-muted-foreground">Choose the period used for salary calculation.</p>
          </div>

          <div className="grid grid-cols-3 gap-1 rounded-2xl border border-border bg-muted p-1">
            {(Object.keys(RANGES) as RangeKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setRangeKey(key)}
                className={[
                  "rounded-xl px-4 py-2 text-sm font-bold transition",
                  rangeKey === key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground",
                ].join(" ")}
              >
                {RANGES[key].label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {errorMessage ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
          <div className="h-80 animate-pulse rounded-3xl bg-muted" />
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <SummaryCard
              label="Total earned"
              value={formatMoney(data.totalEarned, currencySymbol)}
              note={`Last ${selectedRange.days} days`}
            />
            <SummaryCard
              label="Regular hours"
              value={formatHours(data.totalRegularHours)}
              note="base-rate hours"
            />
            <SummaryCard
              label="Overtime"
              value={formatHours(data.totalOtHours)}
              note="overtime hours"
            />
            <SummaryCard
              label="Average day"
              value={formatMoney(averagePerDay, currencySymbol)}
              note="active earning days"
            />
          </div>

          <section className="app-card overflow-hidden">
            <div className="border-b border-border p-5">
              <h3 className="text-lg font-black text-foreground">Daily breakdown</h3>
              <p className="mt-1 text-sm text-muted-foreground">Grouped by work date.</p>
            </div>

            {data.dailyBreakdown.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="font-bold text-foreground">No salary data found.</p>
                <p className="mt-1 text-sm text-muted-foreground">Completed shifts in this range will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {data.dailyBreakdown.map((day) => (
                  <article key={day.date} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                    <div>
                      <p className="font-bold text-foreground">{formatDate(day.date)}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{day.date}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm font-bold text-muted-foreground">Hours</p>
                      <p className="mt-1 text-lg font-black text-foreground tabular-nums">{formatHours(day.hours)}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm font-bold text-muted-foreground">Earned</p>
                      <p className="mt-1 text-lg font-black text-primary tabular-nums">
                        {formatMoney(day.earned, currencySymbol)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
