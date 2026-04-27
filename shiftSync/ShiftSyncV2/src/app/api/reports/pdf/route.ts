import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";

export async function POST() {
  const userId = await requireUserId();
  const sessions = await prisma.workSession.findMany({
    where: { userId, clockOut: { not: null } },
    orderBy: { workDate: "asc" }
  });

  const lines = [
    "ShiftSync Attendance Report",
    "===========================",
    ...sessions.map(
      (s) =>
        `${s.workDate} | ${s.clockIn.toISOString()} - ${s.clockOut?.toISOString()} | ${s.durationMinutes}m | regularRate=${s.appliedRegularRate} otRate=${s.appliedOtRate}`
    )
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="shiftsync-report.pdf"'
    }
  });
}
