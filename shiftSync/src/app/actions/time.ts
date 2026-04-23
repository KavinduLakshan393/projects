"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { WorkSession } from "@prisma/client";

/**
 * Fetches all sessions for the current day, identifying if there's an active one.
 */
export async function getTodaySessions(workDate: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const sessions = await prisma.workSession.findMany({
    where: {
      userId: session.user.id,
      workDate: workDate,
    },
    orderBy: {
      clockIn: "asc",
    },
  });

  const activeSession = sessions.find((s: WorkSession) => s.clockOut === null);
  const completedSessions = sessions.filter((s: WorkSession) => s.clockOut !== null);

  return { activeSession, completedSessions };
}

/**
 * Creates a new WorkSession for the user.
 */
export async function clockIn(workDate: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Prevent double clock-in
  const activeSession = await prisma.workSession.findFirst({
    where: {
      userId: session.user.id,
      clockOut: null,
    },
  });

  if (activeSession) {
    throw new Error("You already have an active shift.");
  }

  // Fetch current rates to freeze them into the session
  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    throw new Error("User settings not found. Please complete onboarding.");
  }

  const newSession = await prisma.workSession.create({
    data: {
      userId: session.user.id,
      workDate,
      clockIn: new Date(),
      appliedRegularRate: settings.regularHourlyRate,
      appliedOtRate: settings.otHourlyRate,
    },
  });

  return newSession;
}

/**
 * Closes the active WorkSession and calculates Regular/OT hours and earnings.
 */
export async function clockOut(sessionId: string, workDate: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Fetch the active session
  const activeSession = await prisma.workSession.findUnique({
    where: { id: sessionId },
  });

  if (!activeSession || activeSession.userId !== session.user.id || activeSession.clockOut !== null) {
    throw new Error("Invalid session or already clocked out.");
  }

  // Fetch user settings for the daily threshold
  const settings = await prisma.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    throw new Error("User settings not found.");
  }

  const clockOutTime = new Date();
  
  // 1. Calculate duration of current session in hours
  const msWorked = clockOutTime.getTime() - activeSession.clockIn.getTime();
  const currentSessionHours = msWorked / (1000 * 60 * 60);

  // 2. Fetch all completed sessions for this specific workDate to calculate cumulative time
  const priorSessions = await prisma.workSession.findMany({
    where: {
      userId: session.user.id,
      workDate: workDate,
      clockOut: { not: null }, // Only completed
      id: { not: sessionId },  // Exclude current just in case
    },
  });

  const previousTotalHours = priorSessions.reduce((acc: number, curr: WorkSession) => {
    return acc + (curr.regularHours || 0) + (curr.otHours || 0);
  }, 0);

  // 3. The Split-Shift Calculation Engine
  const threshold = settings.regularShiftHours;
  let regularHours = 0;
  let otHours = 0;

  const newTotalHours = previousTotalHours + currentSessionHours;

  if (previousTotalHours >= threshold) {
    // Already hit OT in a previous session today; all current hours are OT
    otHours = currentSessionHours;
  } else if (newTotalHours <= threshold) {
    // Still entirely within regular hours
    regularHours = currentSessionHours;
  } else {
    // Current session crosses the threshold!
    regularHours = threshold - previousTotalHours;
    otHours = currentSessionHours - regularHours;
  }

  // 4. Calculate Earnings based on the frozen rates inside the session (Immutability Pattern)
  const totalEarned = (regularHours * activeSession.appliedRegularRate) + (otHours * activeSession.appliedOtRate);

  // 5. Update and close the session
  const updatedSession = await prisma.workSession.update({
    where: { id: sessionId },
    data: {
      clockOut: clockOutTime,
      regularHours,
      otHours,
      totalEarned,
    },
  });

  return updatedSession;
}
