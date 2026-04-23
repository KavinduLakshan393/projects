import { OnboardingForm } from "./OnboardingForm";
import { SessionProvider } from "next-auth/react";

export default function OnboardingPage() {
  return (
    <div className="p-4 max-w-xl mx-auto pt-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Welcome to Shift<span className="text-primary">Sync</span></h1>
        <p className="text-muted-foreground mt-2">Let's set up your default pay rates.</p>
      </div>
      
      <div className="glass p-6 rounded-2xl shadow-sm border border-glass-border">
        {/* SessionProvider is required for the child form to use useSession().update() */}
        <SessionProvider>
          <OnboardingForm />
        </SessionProvider>
      </div>
    </div>
  );
}
