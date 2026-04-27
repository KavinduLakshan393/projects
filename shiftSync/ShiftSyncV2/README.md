# ShiftSync V2

Mobile-first worker attendance and salary tracker built with Next.js App Router and PostgreSQL (Prisma).

## Features

- Session-based split-shift tracking (`clock in` / `clock out`)
- Daily overtime split using user-configured regular shift threshold
- Rate stamping per closed session to preserve historical salary integrity
- Attendance view with per-day session timeline and salary breakdown
- Salary ledger with date-range analysis
- Settings for shift hours, regular/OT rates, and theme preference
- Protected routes via middleware and cookie-backed session (demo auth)
- Export endpoint for attendance report download

## Tech

- Next.js + React + TypeScript
- Prisma ORM + PostgreSQL
- Zod validation for API payloads

## Run locally

1. Install dependencies:
   - `npm install`
2. Configure env:
   - copy `.env.example` to `.env`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate`
5. Start app:
   - `npm run dev`

## Important note

This implementation includes a **demo login flow** (`Continue with Google (Demo)`) so the app is runnable immediately.
Swap it with NextAuth Google OAuth in production.
