# MediFind Project Structure Analysis

## Executive Summary
MediFind is a **React + Vite + Next.js File-Based Routing** application for medicine discovery and drug interaction checking. The project uses a hybrid architecture combining Vite for build tools with Next.js-style file routing in the `/src/app` directory.

---

## 1. Technology Stack & Routing

### Build & Runtime
- **Build Tool**: Vite 8.0.9
- **Framework**: React 19.2.5
- **Type Support**: TypeScript + JSX
- **Styling**: Tailwind CSS 4.2.4 + PostCSS
- **Entry Point**: [src/main.jsx](src/main.jsx)

### Routing Solution: **File-Based Routing (Next.js Style)**
The project uses **Next.js-style file-based routing** despite being a Vite/React application. This is implemented through file structure conventions rather than a routing library:

**Route Structure**:
- `/src/app/page.tsx` → Landing page (root `/`)
- `/src/app/search/page.tsx` → Search results page (`/search`)
- `/src/app/interaction-checker/page.tsx` → Drug interaction checker (`/interaction-checker`)
- `/src/app/medicine/[slug]/page.tsx` → Dynamic medicine detail page (`/medicine/:slug`)

**Important**: There is **NO React Router dependency** in package.json. This routing structure appears to be file-based organization but requires a routing solution to be implemented (likely missing from current setup, causing the npm run dev exit code 1).

---

## 2. Landing Page Component

### File: [src/features/landing/MediFindLandingPage.tsx](src/features/landing/MediFindLandingPage.tsx)

**Purpose**: Main entry point of the application, providing search entry and category discovery.

#### Key Features:
1. **Hero Section with Search Input**
   - Search input for medicines by brand or generic name
   - Type: Text input with icon (search icon)
   - Placeholder: "Search by brand (e.g., Panadol) or generic name..."
   - Form-based search (POST/redirect to search results)

2. **Trust Points Display**
   ```javascript
   const trustPoints = [
     'Search by brand or generic name',
     'Designed for safe, readable medicine lookup',
     'Built to support interaction awareness',
   ];
   ```

3. **Quick Category Cards** (6 categories)
   - Pain Relief
   - Cold & Flu
   - Vitamins
   - Heart Health
   - Allergy Care
   - Family Care

4. **Layout Components Used**
   - Sticky navbar with logo and navigation
   - Hero section with gradient background
   - Responsive grid layout (1-2 columns)
   - Right sidebar with quick stats/CTA

#### UI Color Scheme (Entire App):
- **Primary Blue**: `#2563EB`
- **Background**: `#F8FAFC`
- **Text Primary**: `#1E293B`
- **Text Secondary**: `#64748B`

---

## 3. Search Results Page Component

### File: [src/features/search-results/MediFindSearchResultsPage.tsx](src/features/search-results/MediFindSearchResultsPage.tsx)

**Purpose**: Display search results with filtering capabilities.

#### Key Features:
1. **Static Medicine Data** (Mock Data)
   ```javascript
   const medicines = [
     {
       brand: 'Panadol Advance',
       generic: 'Paracetamol 500mg',
       type: 'OTC',
       price: 'Rs. 320',
       accent: 'teal',
     },
     {
       brand: 'Augmentin',
       generic: 'Amoxicillin + Clavulanic Acid',
       type: 'Rx',
       price: 'Rs. 1,450',
       accent: 'red',
     },
     // ... 3 more medicines
   ];
   ```

2. **Filter Options**
   - Prescription Required
   - Over the Counter (OTC)
   - Tablet
   - Syrup

3. **Layout**
   - Left sidebar: Filter panel (280px fixed)
   - Main area: Medicine cards (responsive grid)
   - Result count display

#### Medicine Data Structure:
```typescript
interface Medicine {
  brand: string;          // Brand name (e.g., "Panadol Advance")
  generic: string;        // Generic name (e.g., "Paracetamol 500mg")
  type: 'OTC' | 'Rx';     // Prescription requirement
  price: string;          // Formatted price (e.g., "Rs. 320")
  accent?: string;        // Color accent (used in rendering)
}
```

---

## 4. Medicine Detail Page Component

### File: [src/features/medicine-detail/MediFindMedicineDetailPage.tsx](src/features/medicine-detail/MediFindMedicineDetailPage.tsx)

**Purpose**: Comprehensive medicine information display with alternatives, side effects, and warnings.

#### Key Features:
1. **Tabbed Content System**
   - Overview
   - Side Effects
   - Warnings

2. **Medicine Information**
   - Brand name and generic name
   - Strength/dosage
   - Prescription status (Rx/OTC)

3. **Alternative Medicines** (Generic substitutes)
   ```javascript
   const alternatives = [
     {
       name: 'Amoxicillin 500mg Capsules',
       manufacturer: 'Generic Pharma Labs',
       price: 'Rs. 920',
       savings: 'Save Rs. 530',
     },
     // ... more alternatives
   ];
   ```

4. **Side Effects Section**
   - Common effects
   - Severe effects (with warnings)

5. **Action Buttons**
   - Save to Profile
   - Share
   - Find Pharmacy

#### UI Components Used:
- [src/components/details/ContentTabs.tsx](src/components/details/ContentTabs.tsx) - Tab navigation
- [src/components/details/ActionRaw.tsx](src/components/details/ActionRaw.tsx) - Action buttons

---

## 5. Interaction Checker Component

### File: [src/features/interaction-checker/MediFindInteractionCheckerPage.tsx](src/features/interaction-checker/MediFindInteractionCheckerPage.tsx)

**Purpose**: Check for drug-drug interactions between medications.

#### Key Features:
1. **Medicine Input System**
   - Multiple input fields (starts with 2)
   - Add/remove medicine inputs dynamically
   - Real-time input handling

2. **Interaction Detection Logic** (Hardcoded patterns)
   ```javascript
   // Pattern matching for dangerous interactions:
   - Warfarin + Ibuprofen → Increased bleeding risk
   - Sildenafil + Nitroglycerin → Blood pressure drop
   - Warfarin + Aspirin → Serious bleeding risk
   ```

3. **Result States**
   - Empty: No medicines or less than 2 medicines
   - Safe: No interactions detected
   - Danger: Interaction found with detailed warning

4. **Result Display**
   - Medicine names
   - Summary of interaction
   - Detailed explanation
   - Medical recommendation

#### State Management:
```typescript
const [medicines, setMedicines] = useState<string[]>(['', '']);
const [hasChecked, setHasChecked] = useState(false);
```

**Search Logic**: Case-insensitive, lowercase normalization of medicine names.

---

## 6. Filter & Search Logic

### Filter System
**File**: [src/components/listings/FilterSideBar.tsx](src/components/listings/FilterSideBar.tsx)

**Filter Types**:
```typescript
interface MedicineFilters {
  prescription: boolean;  // Prescription Required
  otc: boolean;          // Over the Counter
  tablet: boolean;       // Tablet form
  syrup: boolean;        // Syrup form
}
```

**Features**:
- Checkbox-based multi-select filtering
- Price range slider (0 - 5000 Rs)
- Props: `onFilterChange`, `onPriceChange` callbacks
- Currently renders but **no actual filtering logic** is implemented (hooks not wired)

### Search Input Component
**File**: [src/components/shared/InputField.tsx](src/components/shared/InputField.tsx)

**Features**:
- Custom wrapper around HTML input
- Built-in search icon
- Error/helper text support
- Focus states with ring styling
- Used across: Landing page, Interaction checker, Search results

**Props**:
```typescript
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
}
```

---

## 7. Medicine Card Component

### File: [src/components/listings/MedicineCard.tsx](src/components/listings/MedicineCard.tsx)

**Purpose**: Reusable card component to display individual medicine information.

**Props**:
```typescript
interface MedicineCardProps {
  brandName: string;
  genericName: string;
  type: 'rx' | 'otc';
  price: string;
  imageUrl?: string;
  dosage?: string;
  onViewDetails?: () => void;
  showGenericSubstituteBadge?: boolean;
}
```

**Features**:
- Placeholder pill image (SVG) when no imageUrl
- Brand and generic name display
- Status badge (Rx/OTC/Generic)
- Price display
- "View Details" button
- Responsive layout (flex on mobile, grid on desktop)

---

## 8. Shared UI Components

### Status Badge
**File**: [src/components/shared/StatusBadge.tsx](src/components/shared/StatusBadge.tsx)

**Variants**:
- `rx`: Red (prescription required) - `bg-red-50 text-red-600`
- `otc`: Blue (over the counter) - `bg-blue-50 text-blue-700`
- `generic`: Teal (generic substitute) - `bg-teal-50 text-teal-700`

### Primary Button
**File**: [src/components/shared/PrimaryButton.tsx](src/components/shared/PrimaryButton.tsx)
- Standard action button with blue background
- Used throughout: search, interactions check, view details

### Alert Banner
**File**: [src/components/shared/AlertBanner.tsx](src/components/shared/AlertBanner.tsx)
- For warnings and important information

---

## 9. Layout Components

### Sticky Navbar
**File**: [src/components/layout/StickyNavbar.tsx](src/components/layout/StickyNavbar.tsx)

**Features**:
- Logo and branding
- Navigation links (Search, Interaction Checker)
- User profile icon
- Sticky positioning (top: 0, z-50)
- Backdrop blur effect

### Medical Disclaimer Footer
**File**: [src/components/layout/MedicalDisclaimerFooter.tsx](src/components/layout/MedicalDisclaimerFooter.tsx)

### Hero Section
**File**: [src/components/discovery/HeroSection.tsx](src/components/discovery/HeroSection.tsx)

**Props**:
```typescript
interface HeroSectionProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
  footer?: ReactNode;
}
```

---

## 10. Data Flow & State Management

### Current Architecture:
- **No global state management** (Redux, Zustand, etc.)
- **Local component state** using `useState`
- **Prop drilling** for component communication
- **Hard-coded mock data** in components

### Medicine Data Sources (Mock):
1. **Landing Page**: Category definitions
2. **Search Results**: Static 5-medicine array
3. **Medicine Detail**: Alternatives, side effects, warnings
4. **Interaction Checker**: Hard-coded interaction patterns

### State Examples:
```typescript
// Interaction Checker
const [medicines, setMedicines] = useState<string[]>(['', '']);
const [hasChecked, setHasChecked] = useState(false);

// Search Results (not visible in component, should be added)
// Filter state would be: const [filters, setFilters] = useState<MedicineFilters>()
```

---

## 11. Current Issues & Missing Implementations

### Critical Issues:
1. **No Routing Solution**: File-based routes are organized but no router is configured
   - Need: TanStack Router, React Router v6, or custom routing implementation
   - This is causing the `npm run dev` exit code 1

2. **No Actual Search Logic**: Search form in landing page has no submission handler

3. **No Filter Logic**: Filter sidebar renders but doesn't filter results

4. **No Medicine Data API**: All data is hard-coded in components

### Missing Features:
1. State management for search queries
2. Dynamic routing parameter handling (medicine `[slug]`)
3. API integration for medicine database
4. Interaction checker API backend
5. Search results pagination
6. Medicine image uploads/management
7. User authentication/profiles

---

## 12. Directory Structure Summary

```
src/
├── App.jsx                          # Old boilerplate (unused)
├── main.jsx                         # Entry point → MediFindLandingPage
├── app/                             # File-based routing structure
│   ├── layout.tsx                   # Root layout (mostly unused)
│   ├── page.tsx                     # → Landing page
│   ├── search/page.tsx              # → Search results
│   ├── interaction-checker/page.tsx # → Interaction checker
│   └── medicine/[slug]/page.tsx     # → Medicine detail (dynamic)
├── features/                        # Page-level components
│   ├── landing/
│   ├── search-results/
│   ├── medicine-detail/
│   └── interaction-checker/
├── components/                      # Reusable UI components
│   ├── details/                     # Medicine detail UI
│   ├── discovery/                   # Landing page UI
│   ├── layout/                      # Global layout
│   ├── listings/                    # Search result UI
│   ├── safety/                      # Interaction checker UI
│   └── shared/                      # Shared components
├── assets/                          # Images, icons
└── styles/
    └── globals.css                  # Global Tailwind styles
```

---

## 13. Key Takeaways

1. **Architecture**: React SPA with file-based route organization (no active router)
2. **UI Framework**: Tailwind CSS with custom component patterns
3. **Medicine Data**: Brand name, generic name, type (Rx/OTC), price
4. **Color Palette**: Blue (#2563EB) primary, slate grays for text/backgrounds
5. **State**: Local component state only, no global state management
6. **Next Steps**:
   - Implement routing solution (React Router or TanStack Router)
   - Add search functionality
   - Connect to medicine database/API
   - Implement drug interaction backend
   - Add user authentication if needed
