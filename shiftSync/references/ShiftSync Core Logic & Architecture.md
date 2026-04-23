ShiftSync: Core Logic & Architecture Documentation

This document serves as the comprehensive technical foundation and architectural blueprint required to build the ShiftSync application. It details the mathematical logic, file structure, database schema, edge-case handling, and security measures utilizing Next.js (App Router) and PostgreSQL.

By leveraging a heavily typed, strictly relational architecture, ShiftSync ensures absolute data integrity for sensitive financial calculations while maintaining a snappy, mobile-first user experience.

1. Database Structure (PostgreSQL & Prisma)

To ensure strict data integrity, eliminate floating-point financial anomalies, and support the critical "Historical Rate Preservation" requirement, we utilize a relational database schema. Below is the expanded schema represented in Prisma ORM format, engineered for Next.js applications.

model User {
  id            String         @id @default(uuid())
  email         String         @unique
  name          String?
  avatarUrl     String?
  settings      UserSettings?
  sessions      WorkSession[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model UserSettings {
  id                  String   @id @default(uuid())
  userId              String   @unique
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Shift & Financial Baselines
  regularShiftHours   Float    @default(8.0)  // Stored as decimal (e.g., 8.5 for 8h 30m)
  regularHourlyRate   Float    @default(0.0)  // User's base pay per hour
  otHourlyRate        Float    @default(0.0)  // User's overtime pay per hour
  
  // UI & Application Preferences
  themePreference     String   @default("system") // Enum: "dark", "light", "system"
  currencySymbol      String   @default("$")      // Localization support
  
  updatedAt           DateTime @updatedAt
}

model WorkSession {
  id                  String   @id @default(uuid())
  userId              String
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Time Tracking Fundamentals
  workDate            String   // Crucial: Stored as YYYY-MM-DD local time to prevent timezone shift issues at midnight
  clockIn             DateTime // UTC timestamp of clock-in
  clockOut            DateTime? // Nullable: If null, this session is currently active
  durationMinutes     Int      @default(0) // Pre-calculated on clock-out for fast read operations
  
  // Contextual Data
  entryMethod         String   @default("live") // Enum: "live" (tapped button) or "manual" (retroactively added)
  notes               String?  // Optional field for users to log what they worked on during this session
  
  // Historical Rate Preservation (Immutability Pattern)
  // These are stamped permanently the moment the session is closed.
  appliedRegularRate  Float    @default(0.0)
  appliedOtRate       Float    @default(0.0)
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  // Indexing for rapid aggregation queries
  @@index([userId, workDate])
}


1.1 Architectural Database Decisions

UUIDs for Primary Keys: Utilizing UUIDs instead of auto-incrementing integers prevents enumeration attacks (e.g., an attacker guessing session/1234 to view someone else's data) and makes database merging or migrations much safer.

Cascade Deletion: The onDelete: Cascade rule ensures that if a user deletes their account to comply with GDPR/CCPA, all associated settings and work sessions are instantly and cleanly wiped from the database without leaving orphaned rows.

The workDate String Strategy: Storing workDate as a raw string ("YYYY-MM-DD") instead of deriving it dynamically from the UTC clockIn timestamp solves massive localization headaches. A user clocking in at 11:00 PM in California and clocking out at 1:00 AM should have both events tied to the logical "shift day" they started on, rather than splitting across two calendar days based on server UTC time.

2. Shift Management Logic (Handling Split Shifts)

The application fundamentally abandons the traditional "Day" model in favor of a highly flexible "Session" model. A user can have multiple WorkSession records seamlessly tied to a single workDate.

2.1 The Clock-In Action Flow

User taps "Clock In" (or manually selects "Enter Deserved Time").

Validation: The system checks if there is already an active session (clockOut == null) for this user. If true, it rejects the request to prevent double-clocking.

The system creates a new WorkSession record.

clockIn is set to the provided timestamp.

workDate is derived from the user's local device timezone.

entryMethod is flagged as "live" or "manual" for future auditing.

2.2 The Clock-Out Action Flow

User taps "Clock Out" (or selects "Enter Deserved Time").

The system locates the active WorkSession.

Validation: The system ensures the clockOut time is strictly after the clockIn time.

clockOut is updated with the new timestamp.

Time Calculation: The system calculates the absolute difference between clockOut and clockIn in minutes. It updates the durationMinutes integer field. Pre-calculating this drastically speeds up dashboard load times later.

Rate Stamping (Immutability Pattern): The system fetches the user's current regularHourlyRate and otHourlyRate from the UserSettings table and locks them into appliedRegularRate and appliedOtRate on this session. This guarantees that future pay raises do not retroactively inflate past earnings reports.

2.3 Handling Edge Cases & Anomalies

The "Forgotten Clock-Out": If a user clocks in and falls asleep, the session could technically run for 24+ hours. The system must implement a middleware check or a chron job: If a session exceeds 16 hours, it is flagged as "Orphaned". The dashboard will prompt the user to manually fix this session's clock-out time before they are allowed to clock in for a new shift.

Overlapping Manual Entries: If a user tries to manually add a session from 1:00 PM to 3:00 PM, the backend API must query the database to ensure no existing sessions for that user overlap with that specific time window.

3. Salary & Time Calculation Engine

Because users work split shifts across potentially chaotic schedules, Overtime (OT) cannot be calculated on an isolated per-session basis. It must be aggregated and evaluated daily.

3.1 Algorithm: Calculating Daily Salary

Whenever the user views the Dashboard, the Attendance calendar, or generates a PDF Report, the system executes this aggregation pipeline for a given workDate:

Step 1: Aggregate Daily Time

Fetch all completed WorkSessions for the specific workDate.

Total Daily Minutes = Sum of all durationMinutes.

Step 2: Determine Regular vs. OT Minutes

Fetch the user's regularShiftHours limit (e.g., 8 hours = 480 minutes).

Condition A (No Overtime): If Total Daily Minutes <= regularShiftHours:

Regular Minutes = Total Daily Minutes

OT Minutes = 0

Condition B (Overtime Reached): If Total Daily Minutes > regularShiftHours:

Regular Minutes = regularShiftHours (Maxed out at the threshold, e.g., 480 mins)

OT Minutes = Total Daily Minutes - regularShiftHours (The overflow)

Step 3: Calculate Monetary Value (Financial Precision)

Convert minutes to decimal hours for math: (Hours = Minutes / 60).

Fetch the appliedRegularRate and appliedOtRate. (If a user had multiple sessions on the same day, the system defaults to the rates stamped on the first session of that day to maintain consistency).

Regular Pay = (Regular Minutes / 60) * appliedRegularRate

OT Pay = (OT Minutes / 60) * appliedOtRate

Total Daily Pay = Regular Pay + OT Pay

Note on UI Rendering: When displaying these numbers in the UI, JavaScript's Number.prototype.toFixed(2) should be used at the very last moment to ensure standard currency formatting (e.g., converting $190.00000002 to $190.00).

3.2 Complex Example Scenario: The Split Shift Overtime

Setting Baseline: 8 Hour Regular Shift ($20/hr). OT Rate ($30/hr).

Session 1 (Morning Rush): 08:00 AM to 12:00 PM -> 240 mins (4 hours).

Session 2 (Evening Close): 04:00 PM to 09:00 PM -> 300 mins (5 hours).

Algorithmic Flow:

Total Minutes = 540.

540 is > 480 (8 hours). Condition B triggered.

Regular Minutes = 480. OT Minutes = 60.

Regular Pay = 8 hours * $20 = $160.

OT Pay = 1 hour * $30 = $30.

Grand Total for the day: $190.

4. Application File Structure (Next.js App Router)

The project utilizes the Next.js 14+ App Router. This architecture strictly separates React Server Components (RSC) from Client Components, maximizing SEO, performance, and security by keeping sensitive logic entirely on the server.

shiftsync/

prisma/

schema.prisma - Database schema & ORM configuration

migrations/ - Auto-generated SQL migration history

public/

logo.svg - Application branding

manifest.json - PWA configuration for mobile installation

src/

app/

api/ - Serverless Backend Routes (Strictly Server-Side)

auth/

[...nextauth]/route.ts - Google Auth OAuth endpoints

sessions/

route.ts - API for POST (clock-in) and PUT (clock-out)

reports/

route.ts - Heavy PDF generation and buffer streaming API

(auth)/ - Route Group: Authentication views

login/

page.tsx - Unprotected Google Login screen

(protected)/ - Route Group: Protected routes (Requires Auth)

layout.tsx - Global layout wrapping navigation/context

dashboard/

page.tsx - Main real-time tracker dashboard

attendance/

page.tsx - List calendar & PDF export UI

salary/

page.tsx - Financial aggregates & data tables

settings/

page.tsx - User configurations & preference management

layout.tsx - Root HTML layout and Theme Providers

globals.css - Tailwind CSS & root CSS variables

components/ - Modular, Reusable UI Architecture

ui/ - "Dumb" stateless components (Buttons, Inputs, Cards)

layout/ - Structural components (Navbar, Mobile Tab Bar)

features/ - "Smart" components fetching their own data (e.g., ActiveSessionTracker)

lib/ - Core System Utilities

prisma.ts - Singleton Database client instantiation

math-utils.ts - Pure functions for salary/time math (Highly testable)

pdf-generator.ts - Abstraction for the PDF formatting library

types/ - Global TypeScript interface definitions

middleware.ts - Edge computing security gateway

.env - Environment variables (DB URI, Google Secrets)

tailwind.config.ts - Styling and theming configuration

package.json

5. Security & Middleware Logic

Given that ShiftSync handles personal financial data and time logs, security cannot be an afterthought. The application uses a multi-layered security approach.

5.1 Edge Middleware Protection (middleware.ts)

To ensure protected routes are completely inaccessible to unauthenticated users, a middleware.ts file operates at the Edge network level.

Before Next.js even begins rendering the React tree, the middleware intercepts the incoming request and verifies the existence and cryptographic signature of the NextAuth session token.

If a user tries to access /dashboard or /salary without a valid token, they are immediately HTTP 307 redirected to /login. This prevents any "flash" of protected UI or data leakage.

5.2 API Data Isolation (Tenant Security)

Authentication is not authorization. It is not enough that a user is logged in; they must only be able to access their own data.

Every API route under /api/sessions/ or /api/reports/ explicitly extracts the userId from the secure server-side session token.

All Prisma database queries are hard-coded to append where: { userId: session.user.id }.

Prevention: This guarantees that even if a malicious actor intercepts a request and changes a payload ID to view session_999, the database query will fail and return a 403 Forbidden if that session belongs to a different user.

5.3 Payload Validation & Rate Limiting

Zod Validation: All incoming data (like a manual time entry or a settings update) is parsed through Zod schemas before hitting the database. This ensures a user cannot inject malicious strings into the notes field or pass a negative number to regularShiftHours to break the calculation engine.

API Rate Limiting: To prevent abuse (like a user spamming the "Generate PDF" button and crashing the server), critical API routes will be wrapped in a rate-limiter, capping requests to a reasonable threshold (e.g., 5 PDF generations per minute per user).