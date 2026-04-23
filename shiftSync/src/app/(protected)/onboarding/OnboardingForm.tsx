"use client";

import { useState } from "react";
import { submitOnboarding } from "@/app/actions/user";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function OnboardingForm() {
  const [loading, setLoading] = useState(false);
  const { update } = useSession();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      await submitOnboarding(formData);
      
      // Mutate the JWT cookie so middleware knows we've completed onboarding
      await update({ needsOnboarding: false });
      
      router.push("/dashboard");
      router.refresh(); // Ensure RSC payloads are refreshed
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="regularShiftHours" className="block text-sm font-medium text-foreground mb-1">
          Regular Shift Hours
        </label>
        <p className="text-xs text-muted-foreground mb-2">How many hours do you usually work before overtime kicks in?</p>
        <input 
          id="regularShiftHours"
          name="regularShiftHours"
          type="number" 
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
        {loading ? (
          <span className="flex items-center gap-2">
             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
             Saving...
          </span>
        ) : (
          "Complete Setup"
        )}
      </button>
    </form>
  );
}
