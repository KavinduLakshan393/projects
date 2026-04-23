import { SalaryReportView } from "@/components/salary/SalaryReportView";

export default function SalaryPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Salary & Earnings</h1>
      <SalaryReportView />
    </div>
  );
}
