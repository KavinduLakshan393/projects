"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { WorkSession } from "@prisma/client";

export async function getSalaryReport(startDate: string, endDate: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const sessions = await prisma.workSession.findMany({
    where: {
      userId: session.user.id,
      clockOut: { not: null },
      workDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      workDate: "desc",
    },
  });

  let totalEarned = 0;
  let totalRegularHours = 0;
  let totalOtHours = 0;

  // Group by workDate
  const dailyBreakdown: Record<string, { earned: number; hours: number }> = {};

  sessions.forEach((s: WorkSession) => {
    totalEarned += s.totalEarned || 0;
    totalRegularHours += s.regularHours || 0;
    totalOtHours += s.otHours || 0;

    const date = s.workDate;
    if (!dailyBreakdown[date]) {
      dailyBreakdown[date] = { earned: 0, hours: 0 };
    }
    dailyBreakdown[date].earned += s.totalEarned || 0;
    dailyBreakdown[date].hours += (s.regularHours || 0) + (s.otHours || 0);
  });

  return {
    totalEarned,
    totalRegularHours,
    totalOtHours,
    dailyBreakdown: Object.entries(dailyBreakdown).map(([date, data]) => ({
      date,
      ...data,
    })),
  };
}

export async function getAttendanceHistory(limit: number = 30) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const sessions = await prisma.workSession.findMany({
    where: {
      userId: session.user.id,
      clockOut: { not: null },
    },
    orderBy: {
      clockIn: "desc",
    },
    take: limit,
  });

  return sessions;
}
