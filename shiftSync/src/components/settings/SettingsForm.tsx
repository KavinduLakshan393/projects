"use client";

import { useState, useEffect } from "react";
import { updateSettings } from "@/app/actions/settings";
import { useTheme } from "next-themes";

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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      await updateSettings(formData);
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to update settings. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Financial Settings */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">Shift & Pay Baselines</h2>
        <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl space-y-5 border border-border">
          {/* Input Group — label, helper, input with 1.5*8px gap */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="regularShiftHours" className="text-sm font-medium text-foreground">
              Regular Shift Hours
            </label>
            <p className="text-xs text-muted-foreground">Hours before Overtime starts.</p>
            <input 
              id="regularShiftHours"
              name="regularShiftHours"
              type="number" 
              step="0.5"
              defaultValue={initialData.regularShiftHours}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-sm" 
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="regularHourlyRate" className="text-sm font-medium text-foreground">
              Regular Hourly Rate ($)
            </label>
            <input 
              id="regularHourlyRate"
              name="regularHourlyRate"
              type="number" 
              step="0.01"
              defaultValue={initialData.regularHourlyRate}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-sm" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="otHourlyRate" className="text-sm font-medium text-foreground">
              Overtime Hourly Rate ($)
            </label>
            <input 
              id="otHourlyRate"
              name="otHourlyRate"
              type="number" 
              step="0.01"
              defaultValue={initialData.otHourlyRate}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border focus:ring-2 focus:ring-primary outline-none transition-all text-sm" 
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-2.5 px-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 text-sm mt-2"
          >
            {loading ? "Saving..." : success ? "Saved Successfully!" : "Save Changes"}
          </button>
        </form>
      </div>

      {/* App Preferences */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-wider">App Preferences</h2>
        <div className="glass p-6 rounded-2xl space-y-4 border border-border">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-foreground">Theme Preference</span>
            
            {mounted ? (
              <div className="flex bg-surface-elevated p-1 rounded-xl border border-border gap-1">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={[
                      "flex-1 py-2 px-3 text-xs font-medium rounded-lg transition-all capitalize",
                      theme === t 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "text-muted-foreground hover:text-foreground"
                    ].join(" ")}
                  >
                    {t}
                  </button>
                ))}
              </div>
            ) : (
              // Placeholder during SSR to prevent layout shift
              <div className="h-10 w-full bg-surface-elevated rounded-xl border border-border animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
      
      {/* Danger Zone */}
      <div className="pt-4 border-t border-border">
        <button className="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors">
          Delete Account & Data
        </button>
      </div>
    </div>
  );
}
