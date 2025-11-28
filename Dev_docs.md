# Developer Documentation

## Project Overview

**InfinitiveByte Dashboard** is a modern, data-driven web application designed to manage and visualize agency and contact information. It features a robust authentication system, a responsive and professional UI, and efficient data handling capabilities.

The project is built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It uses **PostgreSQL** as the database, managed via **Prisma ORM**, and **Clerk** for secure user authentication.

## Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS v4, Lucide React (Icons), Radix UI (Primitives)
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Authentication**: Clerk
*   **Deployment**: Vercel

## Project Structure

```
/dashboard
├── src/
│   ├── app/                 # Next.js App Router pages and API routes
│   │   ├── api/             # Backend API endpoints (e.g., seed)
│   │   ├── dashboard/       # Protected dashboard routes (agencies, contacts, profile)
│   │   ├── clerk-sign-in/   # Clerk sign-in page
│   │   ├── clerk-sign-up/   # Clerk sign-up page
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Shadcn/ui-like primitives (Button, Card, Table, etc.)
│   │   ├── layout/          # Sidebar, Header
│   │   └── ...              # Feature-specific components (ContactsTable, etc.)
│   ├── lib/                 # Utility functions and server actions
│   │   ├── actions/         # Server Actions for data fetching (agencies.ts, contacts.ts)
│   │   └── utils.ts         # Helper functions (cn, etc.)
│   └── middleware.ts        # Clerk authentication middleware
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma        # Data models
│   └── seed.ts              # Database seeding script
├── public/                  # Static assets
│   └── data/                # CSV files for seeding (agencies, contacts)
├── vercel.json              # Vercel build configuration
└── package.json             # Dependencies and scripts
```

## Key Features

### 1. Authentication & Security
*   **Clerk Integration**: Handles user sign-up, sign-in, and session management.
*   **Middleware**: Protects dashboard routes, ensuring only authenticated users can access data.
*   **Role-Based Access (Future-proof)**: The structure supports expanding to role-based permissions.

### 2. Data Management (Agencies & Contacts)
*   **Server Actions**: Data fetching is handled via Next.js Server Actions (`getAgencies`, `getContacts`) for security and performance.
*   **Pagination**: Both Agencies and Contacts tables support server-side pagination.
*   **Validation**: Page parameters are validated to prevent invalid access (e.g., negative page numbers).
*   **Usage Limits**: A daily limit system restricts the number of contacts a user can view (tracked in `UserUsage` model).

### 3. Database Schema
*   **Agency**: Stores organization details (name, state, phone, etc.).
*   **Contact**: Stores individual contact info, linked to an Agency.
*   **UserUsage**: Tracks daily activity per user to enforce limits.

### 4. UI/UX Design
*   **Professional Theme**: A clean, data-centric design using a blue/navy color palette.
*   **Dark Mode**: Fully supported via `next-themes`.
*   **Responsive**: Layout adapts to mobile and desktop screens.
*   **Interactive Elements**: Hover effects, striped tables, and smooth transitions.

## Development Workflow

### Setup
1.  **Install Dependencies**: `npm install`
2.  **Environment Variables**: Configure `.env` with `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY`.
3.  **Database**: Run `npx prisma migrate dev` to set up the local database.

### Database Seeding
The project includes an automated seeding script (`prisma/seed.ts`) that populates the database from CSV files located in `public/data/`.
*   **Command**: `npx prisma db seed`
*   **Logic**: Checks if data exists; if not, it inserts Agencies first, then Contacts (handling foreign key validation).

### Deployment (Vercel)
*   **Build Command**: `npm run vercel-build`
    *   This custom script runs: `prisma migrate deploy && prisma generate && prisma db seed && next build`.
    *   It ensures the production database is migrated and seeded automatically during deployment.

## Codebase Walkthrough

This section provides a detailed explanation of the key files in the project, explaining their purpose and how they contribute to the overall functionality.

### 1. Core Configuration & Setup

*   **`src/app/layout.tsx`**: The root layout of the application.
    *   **Functionality**: Wraps the entire app with essential providers:
        *   `ClerkProvider`: Enables authentication context throughout the app.
        *   `ThemeProvider`: Manages light/dark mode preferences.
    *   **Key Components**: Includes the `LoadingBar` for navigation feedback and sets up the global font (Geist).

*   **`src/app/globals.css`**: Global stylesheet.
    *   **Functionality**: Defines Tailwind CSS variables for theming (colors, radius) and custom utility classes like `.data-card` for consistent styling.

*   **`middleware.ts`**: Next.js Middleware.
    *   **Functionality**: Intercepts requests to protect routes. It ensures that only authenticated users can access paths starting with `/dashboard`. Unauthenticated users are redirected to the Clerk sign-in page.

### 2. Dashboard Structure (`src/app/dashboard/`)

*   **`layout.tsx`**: The layout specifically for dashboard pages.
    *   **Functionality**: Implements the persistent sidebar and header structure. It uses a flexbox layout to ensure the sidebar stays fixed while the main content area scrolls.

*   **`page.tsx` (Overview)**: The main dashboard landing page.
    *   **Functionality**: Displays high-level statistics (e.g., total agencies count). It fetches data server-side to provide immediate insights upon login.

*   **`agencies/page.tsx`**: The Agencies listing page.
    *   **Functionality**:
        *   Fetches agency data using `getAgencies` server action.
        *   Handles pagination via URL search params (`?page=X`).
        *   **Validation**: Checks if the requested page number is valid. If not, it displays an error message prompting the user to return to the first page.
        *   Renders the data in a responsive table.

*   **`contacts/page.tsx`**: The Contacts listing page.
    *   **Functionality**:
        *   Fetches contact data using `getContacts`.
        *   **Usage Limits**: Checks if the user has exceeded their daily view limit (50 contacts). If so, it hides the data and shows an upgrade prompt.
        *   **Validation**: Similar to agencies, it validates page numbers to prevent invalid access.

### 3. UI Components (`src/components/`)

*   **`layout/Sidebar.tsx`**: The main navigation menu.
    *   **Functionality**:
        *   Responsive design: Collapses on mobile or via a toggle button on desktop.
        *   Highlights the active route.
        *   Includes the "Sign Out" button which triggers Clerk's logout flow.

*   **`layout/Header.tsx`**: The top navigation bar.
    *   **Functionality**:
        *   Displays the user's name and avatar (fetched from Clerk).
        *   Includes the `ThemeToggle` to switch between light and dark modes.

*   **`ContactsTable.tsx`**: A specialized client component for rendering contacts.
    *   **Functionality**:
        *   Displays contact details (Name, Title, Agency, Email, Phone).
        *   **Limit Handling**: If the `limitReached` prop is true, it triggers the `UpgradeModal` to inform the user they've hit their daily cap.
        *   Handles pagination UI (Previous/Next buttons), disabling them when appropriate.

*   **`UpgradeModal.tsx`**: A dialog component.
    *   **Functionality**: Pops up when a user tries to view contacts after exceeding their daily limit. It encourages them to upgrade their plan (currently a mock action).

### 4. Backend Logic & Server Actions (`src/lib/actions/`)

*   **`agencies.ts`**: Handles Agency data fetching.
    *   **`getAgencies(page, pageSize)`**:
        *   Verifies user authentication.
        *   Calculates database offset based on page number.
        *   Runs a transaction to fetch both the data and the total count for pagination.

*   **`contacts.ts`**: Handles Contact data fetching and usage tracking.
    *   **`getContacts(page, pageSize)`**:
        *   **Authentication**: Verifies the user.
        *   **Usage Tracking**: Checks `UserUsage` table for the current date.
        *   **Limit Enforcement**: If usage count >= 50, returns a `DAILY_LIMIT_EXCEEDED` error.
        *   **Data Fetching**: If within limit, fetches contacts and increments the user's usage count in the database.

### 5. Database & Seeding

*   **`prisma/schema.prisma`**: Defines the data model.
    *   **Models**: `Agency`, `Contact`, `User`, `UserUsage`.
    *   **Relations**: Links Contacts to Agencies.
    *   **Indexes**: Adds database indexes on frequently searched fields (name, state, email) for performance.

*   **`prisma/seed.ts`**: The database population script.
    *   **Functionality**:
        *   Reads CSV files from `public/data/`.
        *   **Idempotency**: Checks if data already exists to avoid duplicates.
        *   **Data Integrity**: Verifies that contacts point to valid agencies before insertion, preventing foreign key errors.
        *   **Performance**: Uses `createMany` for bulk insertion, optimized for PostgreSQL.

## Deployment Details

*   **`vercel.json`**: Vercel configuration.
    *   **Build Command**: Overrides the default build command to run `npm run vercel-build`.
*   **`package.json`**:
    *   **`vercel-build` script**: `prisma migrate deploy && prisma generate && prisma db seed && next build`.
    *   This ensures that every deployment automatically migrates the database schema and seeds it with initial data if needed.

---