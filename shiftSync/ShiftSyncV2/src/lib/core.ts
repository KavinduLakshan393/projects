import { z } from "zod";

export const SessionCreateSchema = z.object({
  timestampIso: z.string().datetime(),
  entryMethod: z.enum(["live", "manual"]).default("live"),
  notes: z.string().max(300).optional()
});

export const SessionCloseSchema = z.object({
  timestampIso: z.string().datetime(),
  entryMethod: z.enum(["live", "manual"]).default("live")
});

export const SettingsSchema = z.object({
  regularShiftHours: z.number().min(1).max(24),
  regularHourlyRate: z.number().min(0),
  otHourlyRate: z.number().min(0),
  themePreference: z.enum(["system", "light", "dark"])
});

export const toWorkDate = (date: Date): string =>
  date.toISOString().slice(0, 10);

export const minutesBetween = (start: Date, end: Date): number =>
  Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60000));

export type DailyComputed = {
  totalMinutes: number;
  regularMinutes: number;
  otMinutes: number;
  regularPay: number;
  otPay: number;
  totalPay: number;
};

export function computeDaily(
  durations: number[],
  regularShiftHours: number,
  regularRate: number,
  otRate: number
): DailyComputed {
  const totalMinutes = durations.reduce((sum, item) => sum + item, 0);
  const limit = Math.round(regularShiftHours * 60);
  const regularMinutes = Math.min(totalMinutes, limit);
  const otMinutes = Math.max(0, totalMinutes - limit);
  const regularPay = (regularMinutes / 60) * regularRate;
  const otPay = (otMinutes / 60) * otRate;
  return {
    totalMinutes,
    regularMinutes,
    otMinutes,
    regularPay,
    otPay,
    totalPay: regularPay + otPay
  };
}
