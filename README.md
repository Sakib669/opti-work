# OptiWork MVP

OptiWork is a Next.js App Router MVP for managing workstations, tasks, and productivity with role-based access control.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Shadcn-style UI primitives
- Prisma ORM
- NextAuth.js with credentials provider
- Zod validation

## Setup

1. Copy `.env.example` to `.env`.
2. Update `DATABASE_URL` and `NEXTAUTH_SECRET`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Generate Prisma client and migrate:
   ```bash
   npx prisma db push
   ```
5. Seed the database:
   ```bash
   npx prisma db seed
   ```
6. Run the dev server:
   ```bash
   npm run dev
   ```

## Seeded accounts

- `admin@optiwork.com` / `Password123!`
- `staff@optiwork.com` / `Password123!`

## Pages

- `/` — Public landing page
- `/sign-in` — Sign in page
- `/dashboard` — Stats overview
- `/workstations` — Workstation CRUD and catalog
- `/tasks` — Task management with status updates
