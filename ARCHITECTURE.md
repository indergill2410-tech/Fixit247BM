# Fixit247BM — Architecture

## Overview

Fixit247BM is a **production-grade monorepo** for Australia's premium emergency trade services platform. It connects customers needing urgent home repairs with verified, licenced tradies — 24/7.

---

## Repository Structure

```
Fixit247BM/
├── apps/
│   ├── web/               # Customer & tradie Next.js 15 app (port 3000)
│   └── admin/             # Internal admin console (port 3001)
├── packages/
│   ├── ui/                # Shared component library (Shadcn + Framer Motion)
│   ├── database/          # Prisma ORM + PostgreSQL schema
│   ├── auth/              # Supabase auth + RBAC
│   ├── ai/                # OpenAI job classification & AI features
│   └── payments/          # Stripe Connect escrow & payout logic
├── turbo.json             # Turborepo pipeline
├── pnpm-workspace.yaml    # pnpm workspaces
├── tsconfig.json          # Strict shared TypeScript config
├── .eslintrc.js           # Shared ESLint (strict-type-checked)
├── .prettierrc            # Prettier + tailwindcss plugin
└── .env.example           # All required environment variables
```

---

## Tech Stack

| Layer        | Technology                         |
|--------------|------------------------------------|
| Framework    | Next.js 15 (App Router)            |
| Language     | TypeScript 5 (strict)              |
| Styling      | TailwindCSS + Shadcn UI            |
| Animation    | Framer Motion                      |
| Database     | PostgreSQL (Supabase)              |
| ORM          | Prisma 5                           |
| Auth         | Supabase Auth + SSR cookies        |
| Payments     | Stripe Connect (escrow model)      |
| Realtime     | Socket.io                          |
| AI           | OpenAI GPT-4o (job classification) |
| Build        | Turborepo + pnpm workspaces        |
| Validation   | Zod                                |
| Forms        | React Hook Form + Zod resolvers    |

---

## Roles & Access Control

### CUSTOMER
- Create & manage jobs
- Accept/decline quotes
- Initiate payments (escrow)
- Leave reviews
- Message tradies

### TRADIE
- Browse & quote on available jobs
- Accept jobs & update status
- Receive payouts via Stripe Connect
- Manage availability & documents
- Message customers

### ADMIN
- Full job & user management
- Tradie licence/insurance verification
- Payment oversight & refunds
- Platform reports

### SUPER_ADMIN
- All admin permissions
- Platform configuration
- Feature flags

---

## Database Schema Highlights

- **User** — core entity with role discriminator
- **CustomerProfile / TradieProfile / AdminProfile** — role-specific extension tables
- **Job** — central entity with full status lifecycle + timeline audit log
- **Quote** — tradie bids on jobs
- **Payment** — Stripe escrow with platform fee split
- **Review** — bidirectional (customer ↔ tradie)
- **Message** — per-job chat thread
- **Notification** — typed system + user notifications
- **Licence / Insurance / Certification** — tradie verification documents

---

## Payment Flow (Stripe Connect)

```
Customer pays → PaymentIntent (capture_method: manual)
                     ↓
              Funds held in escrow
                     ↓
        Job completed & approved by customer
                     ↓
         capturePaymentIntent() called
                     ↓
    Platform fee retained (default 15%)
    Tradie receives payout to connected account
```

---

## Auth Flow (Supabase + Next.js Middleware)

1. User submits login form → `POST /api/auth/login`
2. Supabase signs in user, sets SSR cookies
3. Next.js middleware reads session on every request
4. Role checked against route pattern:
   - `/admin*` → requires ADMIN or SUPER_ADMIN
   - `/tradie*` → requires TRADIE
   - `/dashboard*` → requires CUSTOMER
5. Unauthorised → redirect to `/login?redirectTo=<path>`

---

## AI Features

- **Job Classification** — GPT-4o-mini auto-classifies job category, priority, and estimated hours from customer description
- **Smart Matching** *(planned)* — AI ranks tradie candidates by proximity, ratings, availability, and specialisation
- **Dispute Resolution** *(planned)* — AI-assisted evidence review for payment disputes

---

## Environment Setup

```bash
# 1. Clone & install
git clone <repo>
cd Fixit247BM
pnpm install

# 2. Configure environment
cp .env.example .env.local
# Fill in all values in .env.local

# 3. Generate Prisma client
pnpm db:generate

# 4. Run migrations (requires running PostgreSQL)
pnpm db:migrate

# 5. Start development servers
pnpm dev
# web → http://localhost:3000
# admin → http://localhost:3001
```

---

## Package Scripts

| Command            | Description                            |
|--------------------|----------------------------------------|
| `pnpm dev`         | Start all apps in parallel             |
| `pnpm build`       | Production build (all apps)            |
| `pnpm lint`        | ESLint across all packages             |
| `pnpm format`      | Prettier format                        |
| `pnpm type-check`  | TypeScript check (no emit)             |
| `pnpm db:generate` | Generate Prisma client                 |
| `pnpm db:migrate`  | Run database migrations                |
| `pnpm db:push`     | Push schema without migration          |
| `pnpm db:studio`   | Open Prisma Studio                     |

---

## Best Practices

### TypeScript
- `strict: true` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`
- Prefer `type` imports for type-only symbols
- Never use `any` — use `unknown` and narrow

### Security
- All API routes validate input with Zod before processing
- Sensitive env vars never exposed to client (`NEXT_PUBLIC_*` only for safe values)
- Security headers set on all routes (X-Frame-Options, CSP, etc.)
- Supabase Row-Level Security (RLS) should mirror application RBAC

### Components
- All UI primitives live in `packages/ui` — no duplication across apps
- Server Components by default; `'use client'` only at interaction boundaries
- Error boundaries wrapping all dynamic sections
- Loading states for all async data fetches

### Database
- UUID primary keys via `uuid_generate_v4()`
- All foreign keys with appropriate `onDelete` cascades
- Indexes on all foreign keys and commonly filtered columns
- Decimal type for all monetary values (never float)

### Payments
- All amounts stored in AUD, processed as cents with Stripe
- Platform fee configurable via env var (default 15%)
- Escrow model: `capture_method: manual` — funds released only on job completion
