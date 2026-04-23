// ──────────────────────────────────────────────────────────────────────────────
// Global TypeScript Interfaces for ShiftSync
// These mirror the Prisma schema and are used across Server & Client components.
// ──────────────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  settings: UserSettings | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  regularShiftHours: number; // e.g. 8.0 or 8.5
  regularHourlyRate: number;
  otHourlyRate: number;
  themePreference: "dark" | "light" | "system";
  currencySymbol: string;
  updatedAt: Date;
}

export interface WorkSession {
  id: string;
  userId: string;
  workDate: string; // "YYYY-MM-DD"
  clockIn: Date;
  clockOut: Date | null; // null = currently active session
  durationMinutes: number;
  entryMethod: "live" | "manual";
  notes: string | null;
  appliedRegularRate: number;
  appliedOtRate: number;
  createdAt: Date;
  updatedAt: Date;
}

// ── Derived / Computed Types ──────────────────────────────────────────────────

/** Result of the daily salary calculation algorithm */
export interface DailySalaryResult {
  workDate: string;
  totalMinutes: number;
  regularMinutes: number;
  otMinutes: number;
  regularPay: number;
  otPay: number;
  totalPay: number;
  sessions: WorkSession[];
}

/** Entry method options */
export type EntryMethod = "live" | "manual";

/** Theme preference options */
export type ThemePreference = "dark" | "light" | "system";
