import { SalaryReportView } from "@/components/salary/SalaryReportView";

export default function SalaryPage() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pt-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Salary & Earnings</h1>
        <p className="text-muted-foreground text-sm md:text-base mt-1">Track your estimated earnings based on completed shifts.</p>
      </div>
      <SalaryReportView />
    </div>
  );
}
