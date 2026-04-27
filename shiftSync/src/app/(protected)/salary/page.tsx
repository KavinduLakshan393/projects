import { SalaryReportView } from "@/components/salary/SalaryReportView";

export default function SalaryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">Salary & Earnings</h1>
        <p className="text-zinc-400 text-sm md:text-base mt-3 font-medium">Track your estimated earnings based on completed shifts.</p>
      </div>
      <SalaryReportView />
    </div>
  );
}
