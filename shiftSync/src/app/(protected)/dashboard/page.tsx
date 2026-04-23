export default function DashboardPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Good morning, User!</h1>
        <div className="px-3 py-1 bg-surface-elevated rounded-full text-sm border border-border shadow-sm">
          In: 08:00 AM
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-64 h-64 rounded-full bg-success text-success-foreground flex items-center justify-center shadow-lg shadow-success/20">
          <span className="text-3xl font-bold">CLOCK IN</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/3 rounded-full"></div>
        </div>
        <p className="text-center text-sm text-muted-foreground">You have 5h 20m remaining today.</p>
      </div>
    </div>
  );
}
