import { AttendanceView } from "@/components/attendance/AttendanceView";

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <section className="app-card p-5 md:p-7">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Attendance</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Shift records
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Review completed sessions, total duration, overtime, and auto-closed shifts.
        </p>
      </section>

      <AttendanceView />
    </div>
  );
}
