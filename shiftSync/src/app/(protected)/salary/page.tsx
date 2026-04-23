export default function SalaryPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-center mb-6">
        <div className="bg-surface-elevated p-1 rounded-lg border border-border inline-flex">
          <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium">Specific Date</button>
          <button className="px-4 py-1.5 text-muted-foreground rounded-md text-sm font-medium">Date Range</button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border shadow-sm">
        <p className="text-sm text-muted-foreground mb-2">Total Earnings (Apr 1 - Apr 30)</p>
        <p className="text-4xl font-bold tabular-nums">$3,450.00</p>
        <p className="text-sm text-success mt-2 flex items-center gap-1">
          ↑ Up 12% from last month
        </p>
      </div>

      <div className="space-y-4 mt-8">
        <h3 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">This Week</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between py-3 border-b border-border/50">
            <span className="text-foreground">Apr {23 - i}, 2026</span>
            <span className="font-medium tabular-nums">$175.00</span>
          </div>
        ))}
      </div>
    </div>
  );
}
