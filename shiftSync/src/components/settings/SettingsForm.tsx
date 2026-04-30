"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { updateSettings } from "@/app/actions/settings";

interface SettingsFormProps {
  initialData: {
    regularShiftHours: number;
    regularHourlyRate: number;
    otHourlyRate: number;
  };
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMessage("");

    try {
      const formData = new FormData(e.currentTarget);
      await updateSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update settings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="app-card p-5 md:p-6">
        <div className="mb-6">
          <h3 className="text-xl font-black tracking-tight text-foreground">Shift and pay baselines</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            These values are used when new shifts are created. Existing completed records keep their original stamped rates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
              Settings saved successfully.
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="regularShiftHours" className="text-sm font-bold text-foreground">
                Regular shift hours
              </label>
              <p className="mt-1 text-sm text-muted-foreground">Hours worked before overtime starts.</p>
              <input
                id="regularShiftHours"
                name="regularShiftHours"
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                defaultValue={initialData.regularShiftHours}
                required
                className="mt-3 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="regularHourlyRate" className="text-sm font-bold text-foreground">
                Regular hourly rate
              </label>
              <input
                id="regularHourlyRate"
                name="regularHourlyRate"
                type="number"
                min="0"
                step="0.01"
                defaultValue={initialData.regularHourlyRate}
                required
                className="mt-3 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="otHourlyRate" className="text-sm font-bold text-foreground">
                Overtime hourly rate
              </label>
              <input
                id="otHourlyRate"
                name="otHourlyRate"
                type="number"
                min="0"
                step="0.01"
                defaultValue={initialData.otHourlyRate}
                required
                className="mt-3 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:opacity-70 sm:w-auto"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>

      <section className="app-card p-5 md:p-6">
        <div>
          <h3 className="text-xl font-black tracking-tight text-foreground">App preferences</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Choose how ShiftSync should appear on this device.
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold text-foreground">Theme preference</p>

          {mounted ? (
            <div className="mt-3 grid grid-cols-3 gap-1 rounded-2xl border border-border bg-muted p-1">
              {(["light", "dark", "system"] as const).map((themeName) => (
                <button
                  key={themeName}
                  type="button"
                  onClick={() => setTheme(themeName)}
                  className={[
                    "rounded-xl px-3 py-2 text-sm font-bold capitalize transition",
                    theme === themeName
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground",
                  ].join(" ")}
                >
                  {themeName}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-3 h-12 w-full animate-pulse rounded-2xl bg-muted" />
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-muted/45 p-4">
          <p className="text-sm font-bold text-foreground">Account data</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Account deletion is not connected yet. Keep this disabled until a proper delete flow is implemented.
          </p>
          <button
            type="button"
            disabled
            className="mt-4 inline-flex rounded-2xl border border-border px-4 py-2 text-sm font-bold text-muted-foreground opacity-70"
          >
            Delete account unavailable
          </button>
        </div>
      </section>
    </div>
  );
}
