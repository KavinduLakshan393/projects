"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { submitOnboarding } from "@/app/actions/user";

export function OnboardingForm() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { update } = useSession();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const formData = new FormData(e.currentTarget);
      await submitOnboarding(formData);
      await update({ needsOnboarding: false });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to complete setup. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <div>
        <label htmlFor="regularShiftHours" className="block text-sm font-medium text-foreground mb-1">
          Regular Shift Hours
        </label>
        <p className="text-xs text-muted-foreground mb-2">
          How many hours do you usually work before overtime kicks in?
        </p>
        <input
          id="regularShiftHours"
          name="regularShiftHours"
          type="number"
          min="0.5"
          max="24"
          step="0.5"
          defaultValue={8}
          required
          className="w-full p-3 rounded-xl bg-surface border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>

      <div>
        <label htmlFor="regularHourlyRate" className="block text-sm font-medium text-foreground mb-1">
          Regular Hourly Rate ($)
        </label>
        <input
          id="regularHourlyRate"
          name="regularHourlyRate"
          type="number"
          min="0"
          step="0.01"
          defaultValue={0}
          required
          className="w-full p-3 rounded-xl bg-surface border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>

      <div>
        <label htmlFor="otHourlyRate" className="block text-sm font-medium text-foreground mb-1">
          Overtime Hourly Rate ($)
        </label>
        <p className="text-xs text-muted-foreground mb-2">Typically 1.5x your regular rate.</p>
        <input
          id="otHourlyRate"
          name="otHourlyRate"
          type="number"
          min="0"
          step="0.01"
          defaultValue={0}
          required
          className="w-full p-3 rounded-xl bg-surface border border-border focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center py-3.5 px-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100"
      >
        {loading ? "Saving..." : "Complete Setup"}
      </button>
    </form>
  );
}

export default OnboardingForm;