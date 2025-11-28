# Documentation for tarzan Dashboard

---

## Project Overview

**tarzan Dashboard** (also referred to as **Dashboard**) is a modern web application built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. It provides a clean, responsive interface for managing users, agencies, and contacts, with real‑time statistics, theming support, and secure authentication via **Clerk**.

---

## Repository Layout

```
tarzan_Dashboard/
├─ dashboard/                # Next.js application root
│  ├─ src/                  # Source code
│  │  ├─ app/               # App Router pages (e.g., dashboard, clerk sign‑up)
│  │  │  ├─ dashboard/      # Main dashboard page with statistic cards
│  │  │  ├─ clerk-sign-up/  # Clerk sign‑up flow
│  │  │  └─ ...
│  │  ├─ components/        # Re‑usable UI components (Header, PageWrapper, etc.)
│  │  ├─ lib/               # Helper functions, Prisma client, actions
│  │  └─ styles/            # Tailwind configuration and global CSS
│  ├─ public/                # Static assets (images, favicons)
│  ├─ prisma/                # Prisma schema and seed scripts
│  ├─ .env.example           # Example environment variables file
│  ├─ package.json
│  └─ tsconfig.json
├─ README.md                # Project overview (this file is separate)
└─ Diagram.mmd               # Mermaid diagram of the architecture
```

---

## Key Files and Their Purpose
```
-------------------------------------------------------------------------------------------------------------------------------------------------------
| File                                             | Description                                                                                      |
|--------------------------------------------------|--------------------------------------------------------------------------------------------------|
| `package.json`                                   | Lists project dependencies (Next.js, Clerk, Prisma, Tailwind v4, etc.) and scripts including     |
                                                   |  `vercel-build` for deployment.                                                                  |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `next.config.ts`                                 | Next.js configuration with React strict mode, security headers, compression, and image handling. |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `tsconfig.json`                                  | TypeScript compiler options for the project.                                                     |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `prisma/schema.prisma`                           | Prisma data model defining `Agency`, `Contact`, `User`, and `UserUsage` tables with indexes for  |
                                                   | performance.                                                                                     |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `src/app/dashboard/page.tsx`                     | Main dashboard view with statistic cards for agencies and contacts.                              |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `src/app/dashboard/agencies/page.tsx`            | Agencies listing page with professional table styling and pagination.                            |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `src/app/dashboard/contacts/page.tsx`            | Contacts listing page with usage tracking and daily limits.                                      |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `src/app/dashboard/profile/[[...rest]]/page.tsx` | User profile management with Clerk integration and plan selection.                               |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `src/app/api/seed/route.ts`                      | API endpoint for seeding PostgreSQL database on Vercel (protected with secret key).              |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `src/components/ContactsTable.tsx`               | Reusable contacts table component with pagination and upgrade modal.                             |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `src/components/ui/table.tsx`                    | Professional table UI component with enhanced styling.                                           |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `src/components/layout/Sidebar.tsx`              | Collapsible sidebar navigation with theme-aware styling.                                         |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `src/lib/actions/agencies.ts`                    | Server action for fetching agency data with pagination.                                          |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `src/lib/actions/contacts.ts`                    | Server action for fetching contacts with usage tracking and daily limits.                        |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `src/middleware.ts`                              | Clerk middleware protecting dashboard routes.                                                    |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `src/app/globals.css`                            | Global styles with professional data platform color scheme (blue theme) and table styling.       |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `.vercelignore`                                  | Excludes dev.db and local files from Vercel deployment.                                          |
-------------------------------------------------------------------------------------------------------------------------------------------------------
| `vercel.json`                                    | Vercel build configuration.                                                                      |
-------------------------------------------------------------------------------------------------------------------------------------------------------
```
---

## Architecture Summary (see `Diagram.mmd`)

- **Frontend** – Next.js app with React components, styled by Tailwind CSS and Radix UI primitives. UI interactions are enhanced with Framer Motion and Lucide icons.
- **Backend** – API routes built into the Next.js app, using Prisma ORM to communicate with a PostgreSQL database.
- **Authentication** – Managed by Clerk, integrated via `@clerk/nextjs`.
- **Database** – PostgreSQL instance defined by `DATABASE_URL` environment variable.

---

## Setup & Development Workflow

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Dashboard/dashboard
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env.local`.
   - Populate Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) and `DATABASE_URL`.
4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.
5. **Database migration** (if needed)
   ```bash
   npx prisma migrate dev --name init
   ```
6. **Linting**
   ```bash
   npm run lint
   ```

---

*For developer-specific code walkthroughs, see [Dev_docs.md](./Dev_docs.md)*