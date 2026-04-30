"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { UserSettings, WorkSession } from "@prisma/client";

const MINUTES_IN_HOUR = 60;
const MS_IN_MINUTE = 1000 * 60;
const MIN_TIMEZONE_OFFSET = -840; // UTC+14
const MAX_TIMEZONE_OFFSET = 720; // UTC-12

function assertValidWorkDate(workDate: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(workDate)) {
    throw new Error("Invalid work date format. Expected YYYY-MM-DD.");
  }
}

function normalizeTimezoneOffset(timezoneOffsetMinutes: number) {
  if (
    !Number.isInteger(timezoneOffsetMinutes) ||
    timezoneOffsetMinutes < MIN_TIMEZONE_OFFSET ||
    timezoneOffsetMinutes > MAX_TIMEZONE_OFFSET
  ) {
    throw new Error("Invalid timezone offset.");
  }

  return timezoneOffsetMinutes;
}

function getLocalEndOfDayAsUtc(workDate: string, timezoneOffsetMinutes: number) {
  assertValidWorkDate(workDate);

  const [year, month, day] = workDate.split("-").map(Number);

  // JS getTimezoneOffset() returns UTC - local time in minutes.
  // UTC time = local time + timezoneOffsetMinutes.
  return new Date(
    Date.UTC(year, month - 1, day, 23, 59, 59, 999) +
      timezoneOffsetMinutes * MS_IN_MINUTE
  );
}

function getSafeClockOutTime(clockIn: Date, requestedClockOut: Date) {
  if (requestedClockOut.getTime() > clockIn.getTime()) {
    return requestedClockOut;
  }

  // Fallback for corrupted dates/timezone data. Avoids negative or zero durations.
  return new Date(clockIn.getTime() + MS_IN_MINUTE);
}

type WorkSessionWithTimezone = WorkSession & {
  timezoneOffsetMinutes?: number | null;
};

function getStoredTimezoneOffset(workSession: WorkSession) {
  const offset = (workSession as WorkSessionWithTimezone).timezoneOffsetMinutes;

  return typeof offset === "number" ? offset : null;
}

async function calculateSessionTotals({
  userId,
  sessionId,
  workDate,
  clockIn,
  clockOut,
  settings,
  appliedRegularRate,
  appliedOtRate,
}: {
  userId: string;
  sessionId: string;
  workDate: string;
  clockIn: Date;
  clockOut: Date;
  settings: UserSettings;
  appliedRegularRate: number;
  appliedOtRate: number;
}) {
  const durationMinutes = Math.max(
    1,
    Math.round((clockOut.getTime() - clockIn.getTime()) / MS_IN_MINUTE)
  );
  const currentSessionHours = durationMinutes / MINUTES_IN_HOUR;

  const priorSessions = await prisma.workSession.findMany({
    where: {
      userId,
      workDate,
      clockOut: { not: null },
      id: { not: sessionId },
    },
  });

  const previousTotalHours = priorSessions.reduce((total, item) => {
    return total + (item.regularHours ?? 0) + (item.otHours ?? 0);
  }, 0);

  const regularShiftThreshold = Math.max(0, settings.regularShiftHours);
  const newTotalHours = previousTotalHours + currentSessionHours;

  let regularHours = 0;
  let otHours = 0;

  if (previousTotalHours >= regularShiftThreshold) {
    otHours = currentSessionHours;
  } else if (newTotalHours <= regularShiftThreshold) {
    regularHours = currentSessionHours;
  } else {
    regularHours = regularShiftThreshold - previousTotalHours;
    otHours = currentSessionHours - regularHours;
  }

  regularHours = Math.max(0, regularHours);
  otHours = Math.max(0, otHours);

  const totalEarned = regularHours * appliedRegularRate + otHours * appliedOtRate;

  return {
    durationMinutes,
    regularHours,
    otHours,
    totalEarned,
  };
}

async function closeWorkSession({
  workSession,
  settings,
  requestedClockOut,
  autoClosed,
  autoCloseNote,
}: {
  workSession: WorkSession;
  settings: UserSettings;
  requestedClockOut: Date;
  autoClosed: boolean;
  autoCloseNote?: string;
}) {
  const safeClockOut = getSafeClockOutTime(workSession.clockIn, requestedClockOut);

  const totals = await calculateSessionTotals({
    userId: workSession.userId,
    sessionId: workSession.id,
    workDate: workSession.workDate,
    clockIn: workSession.clockIn,
    clockOut: safeClockOut,
    settings,
    appliedRegularRate: workSession.appliedRegularRate,
    appliedOtRate: workSession.appliedOtRate,
  });

  const notes =
    autoClosed && autoCloseNote
      ? [workSession.notes, autoCloseNote].filter(Boolean).join("\n")
      : workSession.notes;

  return prisma.workSession.update({
    where: { id: workSession.id },
    data: {
      clockOut: safeClockOut,
      durationMinutes: totals.durationMinutes,
      regularHours: totals.regularHours,
      otHours: totals.otHours,
      totalEarned: totals.totalEarned,
      autoClosed,
      notes,
    },
  });
}

async function autoCloseStaleActiveSessions({
  userId,
  currentWorkDate,
  fallbackTimezoneOffsetMinutes,
}: {
  userId: string;
  currentWorkDate: string;
  fallbackTimezoneOffsetMinutes: number;
}) {
  const settings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  if (!settings) {
    return;
  }

  const staleActiveSessions = await prisma.workSession.findMany({
    where: {
      userId,
      clockOut: null,
      workDate: {
        lt: currentWorkDate,
      },
    },
    orderBy: [{ workDate: "asc" }, { clockIn: "asc" }],
  });

  for (const staleSession of staleActiveSessions) {
    const timezoneOffsetMinutes = normalizeTimezoneOffset(
      getStoredTimezoneOffset(staleSession) ?? fallbackTimezoneOffsetMinutes
    );

    const autoClockOut = getLocalEndOfDayAsUtc(
      staleSession.workDate,
      timezoneOffsetMinutes
    );

    await closeWorkSession({
      workSession: staleSession,
      settings,
      requestedClockOut: autoClockOut,
      autoClosed: true,
      autoCloseNote:
        "Auto-closed by ShiftSync because this shift was still active after its work date ended.",
    });
  }
}

export async function getTodaySessions(
  workDate: string,
  timezoneOffsetMinutes = 0
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  assertValidWorkDate(workDate);
  const safeTimezoneOffsetMinutes = normalizeTimezoneOffset(timezoneOffsetMinutes);

  await autoCloseStaleActiveSessions({
    userId: session.user.id,
    currentWorkDate: workDate,
    fallbackTimezoneOffsetMinutes: safeTimezoneOffsetMinutes,
  });

  const sessions = await prisma.workSession.findMany({
    where: {
      userId: session.user.id,
      workDate,
    },
    orderBy: {
      clockIn: "asc",
    },
  });

  const activeSession = sessions.find((item) => item.clockOut === null) ?? null;
  const completedSessions = sessions.filter((item) => item.clockOut !== null);

  return { activeSession, completedSessions };
}

export async function clockIn(workDate: string, timezoneOffsetMinutes = 0) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  assertValidWorkDate(workDate);
  const safeTimezoneOffsetMinutes = normalizeTimezoneOffset(timezoneOffsetMinutes);

  await autoCloseStaleActiveSessions({
    userId: session.user.id,
    currentWorkDate: workDate,
    fallbackTimezoneOffsetMinutes: safeTimezoneOffsetMinutes,
  });

  const activeSession = await prisma.workSession.findFirst({
    where: {
      userId: session.user.id,
      clockOut: null,
    },
    orderBy: {
      clockIn: "desc",
    },
  });

  if (activeSession) {
    if (activeSession.workDate === workDate) {
      throw new Error("You already have an active shift for today.");
    }

    throw new Error(
      "You have an active shift on another work date. Refresh the page and try again."
    );
  }

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    throw new Error("User settings not found. Please complete onboarding.");
  }

  return prisma.workSession.create({
    data: {
      userId: session.user.id,
      workDate,
      clockIn: new Date(),
      timezoneOffsetMinutes: safeTimezoneOffsetMinutes,
      appliedRegularRate: settings.regularHourlyRate,
      appliedOtRate: settings.otHourlyRate,
    },
  });
}

export async function clockOut(
  sessionId: string,
  workDate: string,
  timezoneOffsetMinutes = 0
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  assertValidWorkDate(workDate);
  normalizeTimezoneOffset(timezoneOffsetMinutes);

  const activeSession = await prisma.workSession.findUnique({
    where: { id: sessionId },
  });

  if (
    !activeSession ||
    activeSession.userId !== session.user.id ||
    activeSession.clockOut !== null
  ) {
    throw new Error("Invalid session or already clocked out.");
  }

  if (activeSession.workDate !== workDate) {
    throw new Error("The selected work date does not match the active session.");
  }

  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    throw new Error("User settings not found.");
  }

  return closeWorkSession({
    workSession: activeSession,
    settings,
    requestedClockOut: new Date(),
    autoClosed: false,
  });
}
