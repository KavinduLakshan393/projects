export default function SettingsPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">Shift & Pay Baselines</h2>
        <div className="glass p-4 rounded-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Regular Shift Hours</label>
            <input type="number" defaultValue={8} className="w-full p-2.5 rounded-lg bg-surface border border-border focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Regular Hourly Rate ($)</label>
            <input type="number" defaultValue={20.00} className="w-full p-2.5 rounded-lg bg-surface border border-border focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Overtime Hourly Rate ($)</label>
            <input type="number" defaultValue={30.00} className="w-full p-2.5 rounded-lg bg-surface border border-border focus:ring-2 focus:ring-primary outline-none" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">App Preferences</h2>
        <div className="glass p-4 rounded-2xl flex justify-between items-center">
          <span className="font-medium">Dark Theme</span>
          <div className="w-12 h-6 bg-primary rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
