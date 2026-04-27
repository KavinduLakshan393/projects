import { AttendanceView } from "@/components/attendance/AttendanceView";

export default function AttendancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">Attendance Logs</h1>
        <p className="text-zinc-400 text-sm md:text-base mt-3 font-medium">Review your recent shifts and hours worked.</p>
      </div>
      <AttendanceView />
    </div>
  );
}
