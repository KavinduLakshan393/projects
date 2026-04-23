export default function AttendancePage() {
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm">
          Export PDF Report
        </button>
      </div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="glass p-4 rounded-xl flex justify-between items-center">
          <div>
            <p className="font-semibold">Mon, Apr {23 - i}</p>
            <p className="text-sm text-muted-foreground">2 Sessions</p>
          </div>
          <p className="font-bold tabular-nums">8.5 hrs</p>
        </div>
      ))}
    </div>
  );
}
