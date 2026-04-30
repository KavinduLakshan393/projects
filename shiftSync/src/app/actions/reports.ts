"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { WorkSession } from "@prisma/client";

function assertValidDateString(date: string, label: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${label} must use YYYY-MM-DD format.`);
  }
}

export async function getSalaryReport(startDate: string, endDate: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  assertValidDateString(startDate, "Start date");
  assertValidDateString(endDate, "End date");

  if (startDate > endDate) {
    throw new Error("Start date cannot be after end date.");
  }

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

  const dailyBreakdown: Record<string, { earned: number; hours: number }> = {};

  sessions.forEach((item: WorkSession) => {
    const earned = item.totalEarned ?? 0;
    const regularHours = item.regularHours ?? 0;
    const otHours = item.otHours ?? 0;
    const totalHours = regularHours + otHours;

    totalEarned += earned;
    totalRegularHours += regularHours;
    totalOtHours += otHours;

    if (!dailyBreakdown[item.workDate]) {
      dailyBreakdown[item.workDate] = { earned: 0, hours: 0 };
    }

    dailyBreakdown[item.workDate].earned += earned;
    dailyBreakdown[item.workDate].hours += totalHours;
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

export async function getAttendanceHistory(limit = 30) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);

  return prisma.workSession.findMany({
    where: {
      userId: session.user.id,
      clockOut: { not: null },
    },
    orderBy: {
      clockIn: "desc",
    },
    take: safeLimit,
  });
}