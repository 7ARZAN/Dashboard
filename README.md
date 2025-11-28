# InfinitiveByte Dashboard

## Overview

**InfinitiveByte Dashboard** is a professional data platform that provides access to comprehensive agency and contact information. Built with modern web technologies, it offers a clean, responsive interface for browsing and managing educational agency data with advanced features like usage tracking, authentication, and real-time statistics.

## Key Features

- **Professional Data Platform** – Access to agencies and contacts data with pagination and search capabilities
- **Usage Tracking** – Daily limit system (50 contacts/day for free tier) with upgrade options
- **Modern Theming** – Professional light/dark mode with data-focused color scheme
- **Secure Authentication** – Powered by **Clerk** for enterprise-grade security
- **Data Management** – Browse agencies and contacts backed by **Prisma** and PostgreSQL
- **Responsive UI** – Built with **Tailwind CSS v4**, **Radix UI**, and **Framer Motion**
- **Performance Optimized** – Server-side rendering with **Next.js 16**, database indexes, and security headers
- **Production Ready** – Configured for Vercel deployment with automated migrations

## Tech Stack

| Category           | Technologies                                  |
| ------------------ | --------------------------------------------- |
| **Framework**      | Next.js 16, React 19                          |
| **Language**       | TypeScript                                    |
| **Styling**        | Tailwind CSS v4, Radix UI components          |
| **Authentication** | Clerk (Next.js integration)                   |
| **Database**       | Prisma ORM, PostgreSQL                        |
| **Animations**     | Framer Motion                                 |
| **Utilities**      | clsx, class-variance-authority, lucide-react  |
| **Build Tools**    | ESLint, PostCSS                               |

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or hosted)
- Clerk account for authentication

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Dashboard/dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file with:
   ```env
   DATABASE_URL="postgresql://..."
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## Project Structure

```
dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/seed/          # Database seeding endpoint
│   │   ├── clerk-sign-in/     # Clerk authentication
│   │   ├── clerk-sign-up/     # Clerk registration
│   │   └── dashboard/         # Main application pages
│   ├── components/            # Reusable UI components
│   └── lib/                   # Utilities and server actions
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets and CSV data
└── package.json
```

## Features

### Data Access
- **Agencies**: Browse educational agencies with state, city, and contact information
- **Contacts**: Access contact details with daily usage limits
- **Pagination**: Efficient data browsing with server-side pagination

### User Management
- **Clerk Authentication**: Secure sign-in/sign-up with Google OAuth support
- **Usage Tracking**: Monitor daily contact views with automatic reset
- **Profile Management**: Update user information and view usage statistics

### Professional Design
- **Data-Focused Theme**: Professional blue color scheme optimized for data platforms
- **Responsive Tables**: Striped rows, enhanced headers, and hover effects
- **Dark Mode**: Sophisticated dark theme with deep navy backgrounds

---

*For detailed documentation, see [Documentation.md](./Documentation.md)*
*For developer-specific code walkthroughs, see [Dev_docs.md](./Dev_docs.md)*

### Created by 7ARZAN © 2025 ###