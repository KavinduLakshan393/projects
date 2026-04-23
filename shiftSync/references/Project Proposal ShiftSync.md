Project Proposal: ShiftSync (Worker Attendance & Salary Tracker)

1. Executive Summary

ShiftSync is a mobile-first SaaS web application meticulously designed to empower workers by giving them unprecedented, personal access to their time logs and earned salary data. In today’s gig economy and shift-based workforce—spanning retail, healthcare, hospitality, and freelance sectors—enterprise HR software overwhelmingly caters to the employer. Workers often lack real-time visibility into their own logged hours, leading to anxiety over paychecks, difficult dispute resolutions, and a lack of day-to-day financial awareness.

ShiftSync solves this critical transparency gap. It is a worker-centric, standalone tool allowing users to accurately track complex split shifts, view real-time salary accrual, and generate structured, professional PDF attendance reports directly from their mobile devices. By democratizing this data, ShiftSync not only provides a practical utility but also offers immense psychological benefits: enhancing worker motivation, enabling precise personal financial planning, and providing irrefutable proof of work hours.

2. Core Architecture & Global Logic

To support modern features, ensure rapid performance on mobile networks, and guarantee strict financial data integrity, the application will be engineered using a robust modern stack: Next.js (React) for the full-stack framework and a PostgreSQL database.

Next.js Advantages: Utilizing Next.js allows us to leverage Server-Side Rendering (SSR) for blazing-fast initial load times, which is crucial for workers quickly opening the app on the go. Its integrated API routes will securely handle our PDF generation and complex salary aggregation algorithms without needing a separate backend server.

PostgreSQL Advantages: Time and money are relational and strictly structured. PostgreSQL ensures ACID compliance, preventing scenarios where a session might be saved without a user ID, or financial aggregations calculate incorrectly.

The "Split Shift" Engine (Core Logic)

The traditional "one shift per day" model is fundamentally flawed for modern workers. ShiftSync implements a highly flexible "Session-based" model to accommodate erratic schedules, such as a restaurant server working a lunch rush, taking a three-hour break, and returning for dinner service.

Sessions as the Source of Truth: Every time a user clocks in and out, a discrete Session record is created with exact timestamps. A single Date entity serves as a parent to an infinite array of these Sessions.

Dynamic Time Calculation: Total Daily Minutes is derived exclusively by calculating the duration of each individual session and summing them. This handles overlapping days and micro-shifts flawlessly.

Intelligent Overtime (OT) Calculation: OT triggers automatically only when the Total Daily Minutes exceeds the user's defined Regular shift hours threshold from their settings. If a user's threshold is 8 hours, and they work two 5-hour split sessions, the first 8 hours are billed at the regular rate, and the remaining 2 hours are dynamically shifted to the OT bucket.

Precision Salary Calculation: Total Pay = (Regular Hours × Regular Rate) + (OT Hours × OT Rate). These calculations are performed at the database query level to ensure the UI is always reflecting accurate, rounded-to-the-cent figures.

3. Detailed Page Breakdown

3.1. User Dashboard

Purpose: The central hub for real-time tracking, immediate gratification, and frictionless quick actions. It is designed to be readable at a glance within seconds.

Contents & Interactions:

Dynamic Greeting & Motivation: A randomized greeting (e.g., "Good morning, 

$$Name$$

! Let's crush today.") paired with subtle gamification elements to start the shift on a positive note.

First Arrival Card: Displays the time of the very first clock-in for the current day. This anchors the user's perception of how long their overall workday has been, regardless of split shifts.

Action Button (Clock In / Clock Out): A massive, thumb-friendly toggle button. It will utilize distinct color psychology—perhaps a vibrant green for "Clock In" and a warning orange/red for "Clock Out" to prevent accidental taps.

Progress Bar & Status Text: A highly visual indicator of daily shift completion. As the user works, the bar fills up. When OT is reached, the bar can change color (e.g., to gold or purple) to visually reward the user for their extra effort. Text dynamically reads: "You have 

$$X hours/minutes$$

 remaining to complete your shift for today" or "You are in Overtime!"

Earnings Card: Displays the cumulative earned gross salary for the current month. Seeing this number tick upward daily is the core retention loop of the application. It contains a direct routing link to the deep-dive Salary Viewer.

Weekly Trend Graph: A sleek, minimal bar chart visualizing the total hours worked each day over the last 7 rolling days. Tapping a bar will show a tooltip with exact hours and minutes.

Logic Flow:

State Initialization: On load, the page checks the database for an active session (a clock-in timestamp lacking a corresponding clock-out timestamp) for the current user today.

Adaptive Button State: The UI reacts to the database state. If an active session exists, the UI transforms to the "Clock Out" state. If no active session exists, it defaults to "Clock In".

Clocking In/Out with Failsafes: Clicking the button triggers a confirmation modal. Because humans are forgetful, the user is presented with choices: "Use Current Time" (default quick action) or "Enter Deserved Time" (manual entry for when they forgot to clock in an hour ago).

Live Progress Calculation: The progress bar continuously queries all completed sessions for today, adds the live, ticking elapsed time of the active session, and divides by the user's target shift hours to calculate the fill percentage.

3.2. Attendance Viewer Page

Purpose: A detailed, auditable log of historical work data and the engine for formal report generation.

Contents & Interactions:

Report Generator Engine: A prominent button labeled "Export PDF Report" anchored at the top of the view.

Infinite Scroll List-Style Calendar: Eschewing the clunky grid calendar, this is a clean, vertical list of dates where the user has logged time, grouped by month and year for easy chronological scrolling.

Expandable Daily Accordions: Interactive daily cards that expand to reveal the granular breakdown of the day's activity.

Logic Flow:

Optimized List Rendering: The page fetches unique dates from the database where the user has at least one session, ordered chronologically descending. Pagination or infinite scroll is implemented here to prevent payload bloat on users with years of data.

Granular Card Logic: Upon expanding a date, the UI fetches and performs heavy calculations to display:

A chronological timeline of all split shifts (e.g., Session 1: 08:00 AM - 12:00 PM | Session 2: 03:00 PM - 06:30 PM).

Total Regular Hours and Total OT Hours distinctly separated.

The financial breakdown: Calculated Regular Salary, OT Salary, and the Grand Total Daily Salary.

PDF Generation Pipeline: Clicking export opens a date-range picker. Upon submission, the Next.js API route securely aggregates all sessions within that window. It uses a server-side library (like pdfkit or @react-pdf/renderer) to generate a highly structured, branded PDF document. This document includes summary tables, daily breakdowns, and totals, which is then streamed back to the mobile device for saving, printing, or emailing directly to an employer or accountant.

3.3. Salary Viewer Page

Purpose: The financial deep dive. This page transforms raw time data into meaningful financial insights, acting as a personal ledger.

Contents & Interactions:

"Analyze Salary" Filter Module: A sticky top section with comprehensive filtering capabilities.

Filter Options: * (i) Specific Date (e.g., "What did I make on July 4th?").

(ii) Specific Date Range (e.g., "What did I make in Q2?").

(iii) Quick Presets (e.g., "This Week", "Last Month", "Year to Date").

Historical Ledger List: A descending, clearly delineated list of past days and their corresponding earnings, utilizing green text for positive financial reinforcement.

Logic Flow:

Default View: Instantly loads the current billing cycle (e.g., the last 30 days or the current calendar month) to provide immediate context without requiring user input.

Advanced Filtering Logic:

Single Date Query: The database isolates all sessions for that exact date, executes the salary calculation algorithm, and renders a highly detailed single-day receipt.

Range Aggregation: The database executes complex GROUP BY SQL aggregations. It processes daily totals for potentially hundreds of days, sums them, and renders a top-level Grand Total card, followed by the itemized list of the individual days comprising that total.

3.4. Settings Page

Purpose: The configuration matrix for the user's personal shift parameters, financial baselines, and app preferences.

Contents & Interactions:

Input: Regular Shift Hours: A numeric input for the user's baseline daily threshold (e.g., 8 or 12 hours).

Input: Regular Salary Per Hour: A currency-formatted input (e.g., $20.50/hr).

Input: OT Salary Per Hour: A currency-formatted input (e.g., $30.75/hr).

UI Preference: A toggle for Dark Mode / Light Mode / System Default.

Data Management: Options to export raw CSV data or delete the account (compliance requirements).

Logic Flow:

State Retrieval: Loads current user preferences from the database upon component mount.

Crucial Financial Immutability (Historical Rate Preservation): This is the most complex logic in the settings. When a user receives a raise and changes their hourly rates, the system must absolutely not alter historical data.

Implementation Strategy: Every time a new Session is closed and written to the database, it permanently "stamps" or inherits the hourly rates that were active at that exact moment in time. Alternatively, the settings table must maintain a history of effective dates. This ensures last year's earnings reports remain 100% accurate even if the user's salary doubles today.

Contextual Theme Logic: Toggling dark mode instantly updates the React Global Context, applying CSS variables across the entire DOM, and simultaneously persists the preference to localStorage to prevent a flash of the wrong theme on the next visit.

4. Authentication Module (Google Auth)

Purpose: To provide a frictionless, highly secure, and entirely passwordless entry point into the application. By leveraging Google Auth, we drastically reduce onboarding friction, eliminate the risk of forgotten passwords, and ensure strict, cryptographically secure isolation of every user's highly sensitive financial data.

Contents (Login Page):

App Logo & Aesthetic: A pristine, welcoming landing screen featuring the ShiftSync logo and typography.

Compelling Value Proposition: A clear, motivating tagline (e.g., "Track your time. Know your worth. Own your data.").

Single-Action Authentication: A prominent, instantly recognizable "Continue with Google" button utilizing standard Google branding guidelines.

Logic Flow:

Ironclad Routing Security: Every application page outlined in Section 3 (Dashboard, Attendance, Salary, Settings) is strictly protected by Next.js edge middleware. If an unauthenticated or expired user attempts to navigate to /dashboard, the middleware intercepts the request instantly and forces a redirect to the Login Page, preventing any brief flashes of protected UI.

The OAuth 2.0 Trigger: Tapping "Continue with Google" initiates an industry-standard OAuth 2.0 flow (managed securely via libraries like NextAuth.js or Supabase Auth). The user is safely routed to Google's highly secure, external login portal.

Seamless Callback & Provisioning: Once the user authenticates and grants basic profile access, Google redirects them back to our application carrying a secure authorization payload.

First-Time User Onboarding: The backend checks the database. Not finding the Google ID, it automatically provisions a new row in the Users table, extracting their verified email, first name, and profile picture URL. Instead of the dashboard, they are seamlessly routed to an onboarding wizard (a simplified Settings page) to input their vital baseline data (Hourly Rate, Shift Hours) so the app functions correctly from day one.

Returning User Flow: The system matches the unique Google ID, mints a secure, encrypted JWT (JSON Web Token) session cookie, and instantly drops them into their User Dashboard with their data pre-loaded.

Persistent Session Management: The user remains securely logged in across multiple browsing sessions and app closures via HTTP-only, secure cookies, striking the perfect balance between convenience and security.

Personalized UI Integration: The user's parsed Google first name and avatar are injected into the React context, populating the Dashboard's "Dynamic Greeting" and header, creating a personalized, premium software feel.