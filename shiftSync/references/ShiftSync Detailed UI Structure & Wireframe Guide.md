ShiftSync: Detailed UI Structure & Wireframe Guide

This document translates the conceptual design system into a concrete, structural layout. It details the exact positioning, spatial hierarchy, interaction flows, and micro-interactions of every UI element across the application. It assumes a strict "Mobile-First" default view, prioritizing touch ergonomics and cognitive ease for workers on the go.

1. Global Application Shell

Regardless of the specific page the user is on (once authenticated), the application utilizes a persistent, highly optimized outer shell to anchor navigation, provide consistent context, and establish spatial boundaries.

1.1 The Top Header (Sticky & Responsive)

Position & Physics: Fixed to the absolute top of the viewport. To maximize vertical screen real estate on small devices, this header utilizes a "hide-on-scroll-down, reveal-on-scroll-up" behavior.

Aesthetic (Glassmorphism): The background color matches the theme's base background (Cool Gray 100 in Light Mode, Deep Charcoal in Dark Mode) but incorporates a translucent blur effect (backdrop-blur-md with bg-opacity-80). This ensures content scrolling beneath it remains slightly visible, maintaining a sense of depth.

Left Side: The "ShiftSync" typographic logo or a small, recognizable brand icon. Tapping this acts as a failsafe "Home" button, instantly returning the user to the top of the Dashboard.

Right Side: The user's Google Profile Avatar (a small, circular image, approx. 32x32px with a subtle ring-2 border).

Interaction: Tapping this avatar opens an elegant bottom-sheet modal rather than a jarring full-page redirect. This sheet contains:

User's full name and email (read-only context).

"Support / Help" link.

A prominent, red "Sign Out" button.

1.2 The Bottom Navigation Bar (Sticky & Ergonomic)

Position: Fixed to the absolute bottom of the viewport. Crucially, it accounts for modern smartphone "Safe Areas" (like the iOS Home Indicator line) by adding pb-safe padding, preventing accidental app closures when attempting to tap a tab.

Structure: A horizontal flexbox containing four equally spaced tap targets. Each target area is a minimum of 48x48px to ensure strict compliance with touch-target accessibility standards.

Items & Labels:

Home (Dashboard): Icon of a house.

Attendance: Icon of a calendar or list.

Salary: Icon of a wallet or bank note.

Settings: Icon of a gear/cog.

Interaction & Feedback: * Active State: The active page icon is tinted in the Primary Brand color (Electric Indigo), scaled up slightly (scale-110), and a tiny, bold text label appears beneath it.

Inactive State: Inactive icons remain a muted gray, and their text labels are hidden to reduce visual clutter.

Haptics: Switching tabs triggers a very light, crisp haptic tap.

2. Page-by-Page UI Breakdown

2.1 Authentication Screen (Login)

Layout: A full-screen flex container, perfectly centered vertically and horizontally. There is no top header or bottom navigation to distract the user.

Background: To prevent a stark, boring screen, a subtle, highly transparent geometric pattern or a soft, slow-moving gradient mesh sits in the absolute background.

Top: A large, high-resolution ShiftSync logo, animated with a subtle fade-in and slide-up motion on initial load.

Middle: A brief, welcoming tagline centered under the logo (e.g., "Track your time. Know your worth."). Typography here is medium weight, utilizing the secondary text color.

Bottom Center (The Gateway): The "Continue with Google" button.

Design: A wide, pill-shaped button featuring the multi-colored Google 'G' logo on the left and the text centered. It possesses a high drop-shadow to make it the most prominent element on screen.

Loading State: Upon tapping, the text fades out and is replaced by a spinning loading indicator, preventing the user from double-tapping while the OAuth redirect initializes.

2.2 User Dashboard (The Home Screen)

Scroll Behavior: Vertically scrollable, but heavily engineered so the primary "Clock In/Out" action button is always visible above the digital fold without requiring a scroll.

Section 1: The Greeting & Context

Layout: A horizontal row with flexbox justify-between.

Left: A large, dynamic text block: "Good morning, 

$$User First Name$$

!". The greeting changes based on the local time (Morning, Afternoon, Evening, Late Night).

Right: The "First Arrival" mini-card. A small, pill-shaped UI element with a clock icon reading "In: 08:00 AM". If the user hasn't clocked in yet today, this pill gracefully collapses to zero width and is hidden.

Section 2: The Core Action Area

Layout: Centered prominently in the upper half of the screen, surrounded by ample white space to draw the eye.

The Button: A massive circular or heavily rounded rectangular button.

State 1 (Inactive): If clocked out, it's Emerald Green reading "CLOCK IN".

State 2 (Active): If clocked in, it's Coral Red reading "CLOCK OUT".

State 3 (Offline): If the device loses internet connection, the button fades to a muted gray, displaying a strike-through cloud icon and reading "OFFLINE", temporarily disabling the action until connectivity returns.

The Pop-up Modal: When tapped, a modal slides up from the bottom of the screen. It contains two large buttons stacked vertically: "Proceed with Current Time" (Primary, highlighted) and "Enter Deserved Time" (Secondary, opens a native OS time-picker wheel for manual adjustments).

Section 3: The Progress Tracker

Layout: Sits directly underneath the massive action button.

The Bar: A full-width horizontal track (h-4, fully rounded). The fill bar grows left-to-right smoothly via CSS transitions.

The Text: Centered directly beneath the bar. E.g., "You have 3h 15m remaining to complete your shift for today."

Section 4: Financial Snapshot

Layout: A rectangular, highly elevated card spanning the width of the screen.

Content: Title "Current Month Earnings" on the top left. A privacy "Eye" toggle icon on the top right. In the center, a massive, bold currency figure utilizing tabular numbers (e.g., "$1,245.50").

Action: Tapping anywhere on this card acts as a shortcut link, routing the user to the full Salary Viewer page.

Section 5: The Weekly Graph

Layout: A card at the bottom of the scroll view. Contains a simple 7-bar chart visualizing hours worked over the last 7 days.

Empty State: If the user is brand new and has no data, the chart displays a beautifully illustrated empty state (e.g., a sleeping cat or an empty coffee cup) with encouraging text: "Clock in to start building your streak!"

2.3 Attendance Viewer Page

Scroll Behavior: The page consists of a sticky top action bar and a long, vertically scrolling list below it.

Top Action Bar (Sticky): Sits just below the global top header. Contains a full-width "Generate PDF Report" button. Tapping it opens a modal containing native date-picker inputs for "Start Date" and "End Date".

The Calendar List:

Loading State: While fetching data, the screen displays a skeleton loader—3 to 4 gray, pulsing rectangles that mimic the shape of the date cards.

Default View (Collapsed): A vertical stack of rectangular cards. Each card represents one workDate. The card shows the date on the left ("Mon, Apr 23") and the total hours worked that day on the right ("8.5 hrs").

Expanded View (The Split Shift Detail): When a user taps a date card, it expands vertically (accordion style) with a smooth spring physics animation. Inside the expanded area, the UI displays:

Timeline: A visual vertical line on the left, connecting dots representing time entries.

Sessions: Stacked rows showing the split shifts.

Row 1: Session 1 (08:00 AM - 12:00 PM)

Row 2: Session 2 (02:00 PM - 06:30 PM)

Manual Edit/Delete: Swiping left on any specific session row reveals a "Delete" (Red) and "Edit" (Blue) quick-action button, allowing users to correct mistakes.

Daily Totals Block: A small grid at the bottom of the expanded area summarizing the exact math:

Regular: 8h ($160) | OT: 0.5h ($15)

Total Day Salary: $175.00

2.4 Salary Viewer Page

Top Section: Filter Controls

A sticky segment control pill just beneath the global header.

It has two toggleable sides: "Specific Date" and "Date Range". Tapping one reveals the corresponding date-picker inputs immediately below it.

Middle Section: The Grand Total Card

A massive, highly elevated card. The background features a subtle gradient to make it feel premium, like a high-end credit card.

Displays the sum of all earnings based on the filter selected above.

Example: "Total Earnings (Apr 1 - Apr 30): $3,450.00".

Trend Indicator: A small green arrow pointing up (or red arrow down) comparing the current selected range to the previous equivalent range (e.g., "Up 12% from last month").

Bottom Section: The Historical Ledger

A scrolling list of rows, grouped by week or month using sticky sub-headers.

Layout of a Row: Flexbox justify-between. Left side shows the date ("Apr 23, 2026"). Right side shows the exact financial amount earned that day ("$175.00"). The numbers are strictly right-aligned so the decimal points line up perfectly as the user scrolls down the list, allowing the eye to easily scan for anomalies.

2.5 Settings Page

Scroll Behavior: Standard vertical scroll, with grouping that mimics native iOS or Android system settings.

Layout Style: A grouped list format where related inputs are clustered together inside cards with subtle borders.

Group 1: Shift & Pay Baselines

Input 1: "Regular Shift Hours". Focus triggers a numeric-only keypad. A small sub-label reads "Hours before OT kicks in."

Input 2: "Regular Hourly Rate". Focus triggers a decimal keypad.

Input 3: "Overtime (OT) Hourly Rate". Focus triggers a decimal keypad.

Interaction & Feedback: Tapping an input highlights its border in Electric Indigo. If the user edits a field, a floating "Save Changes" toast appears at the bottom of the screen.

Group 2: App Preferences

Dark Mode Toggle: A row containing the text "Dark Theme" on the left, and a visual toggle switch (slider) on the right. Tapping it instantly swaps the global CSS variables.

Group 3: Account & Compliance (Bottom)

A secondary, less prominent button: "Export Raw CSV Data".

A destructive, red-text button at the very bottom: "Delete Account & Data". Tapping this requires the user to type the word "DELETE" in a confirmation modal to prevent accidental erasure.

3. Modals, Pop-ups, and Transient UI

To avoid navigating away from the user's current context and losing their mental map, secondary actions and notifications utilize overlays.

Bottom Sheets (Mobile Default for Actions): For actions like "Select Date Range" or "Choose Clock-In Time," a panel slides up from the bottom of the screen, covering the lower 50%.

Physics: Users can swipe down on the sheet to dismiss it naturally.

Overlay: The background darkens (bg-black/50) and slightly blurs to focus all attention on the sheet.

Center Modals (Critical Confirmations): Used strictly for destructive or critical confirmations (e.g., "Are you sure you want to delete this session?"). These appear in the dead-center of the screen and require an explicit "Cancel" or "Confirm" tap—they cannot be dismissed by swiping.

Snackbars / Toasts (Transient Feedback): For non-blocking notifications (e.g., "Settings Saved" or "Session Logged Successfully"), a small, pill-shaped banner slides down from the top of the screen (or up from the bottom nav bar). It displays a success checkmark and a brief message, disappearing automatically after 3 seconds without requiring user interaction.