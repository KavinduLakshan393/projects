-- Add fields required by the stale active shift auto-close logic.
-- Safe for PostgreSQL development databases where the columns may already exist.

ALTER TABLE "WorkSession"
ADD COLUMN IF NOT EXISTS "timezoneOffsetMinutes" INTEGER;

ALTER TABLE "WorkSession"
ADD COLUMN IF NOT EXISTS "autoClosed" BOOLEAN NOT NULL DEFAULT false;
