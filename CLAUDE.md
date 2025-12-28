# Organize My CPE

## Project Status: MVP Complete

**Last Updated:** 2025-12-28
**Phase:** 4 - Production Hardening (Complete)

## Overview

SaaS application for CPAs to manage CPE (Continuing Professional Education) compliance across all 50 US states plus DC.

**Pricing:** $9.99/year
**Stack:** Next.js 14, TypeScript, Prisma, PostgreSQL, Clerk, Stripe

## Completed Phases

### Phase 1: Foundation
- Next.js 14 App Router setup
- Prisma schema (UserProfile, StateRule, CourseRecord, Document, Export)
- Tailwind CSS with shadcn/ui components
- S3-compatible storage integration

### Phase 2: Core Features
- File upload (PDF, CSV, XLSX, ZIP)
- AI-powered text extraction (OpenAI GPT-4o-mini)
- Course record CRUD operations
- Dashboard with compliance overview

### Phase 3: Compliance Engine
- 51 jurisdiction rules (50 states + DC)
- All cycle types: CALENDAR_YEAR, BIENNIAL_EVEN/ODD, ROLLING, TRIENNIAL
- Ethics, A&A, tax, technical subject tracking
- State-specific export generation (CSV, XLSX)

### Phase 4: Production Hardening
- Clerk authentication middleware
- Rate limiting (60/min default, 10 for uploads, 5 for exports)
- Security headers (HSTS, X-Frame-Options, CSP)
- .env.example with documentation

## Key Files

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema |
| `prisma/seed-states.ts` | 51 state CPE rules |
| `src/lib/rules-engine.ts` | Compliance calculation |
| `src/lib/export-generator.ts` | State report generation |
| `src/lib/stripe.ts` | Billing integration |
| `src/lib/auth.ts` | Clerk auth utilities |
| `src/middleware.ts` | Auth + rate limiting |

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection
- `CLERK_SECRET_KEY` / `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `STRIPE_PRICE_ID`
- `OPENAI_API_KEY` - For certificate extraction
- `S3_*` - Storage configuration

## Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run db:push    # Push Prisma schema
npm run db:seed    # Seed state rules
```

## Deployment Checklist

1. [ ] Create Clerk app at dashboard.clerk.com (brandonhayman.b@gmail.com)
2. [x] Create Stripe product ($9.99/year) - `prod_TgpQFGQWrrOS7o`
3. [ ] Configure Stripe webhook: `/api/stripe/webhook`
4. [ ] Get Stripe publishable key from dashboard
5. [ ] Set all environment variables
6. [x] Run `prisma db push && prisma db seed` - 51 states seeded
7. [ ] Deploy to Vercel/Railway/DO App Platform

## Documentation

| Document | Purpose |
|----------|---------|
| `docs/COMPETITIVE_ANALYSIS.md` | Competitor research and positioning |
| `docs/MARKETING_STRATEGY.md` | SEO/AEO strategy and launch plan |
| `docs/PRODUCTION_CHECKLIST.md` | Deployment readiness validation |
| `docs/SECURITY_AUDIT.md` | Security review |

## Stripe Configuration

- **Product ID:** `prod_TgpQFGQWrrOS7o`
- **Price ID:** `price_1SjRlJCncK0NQAfvKTjhkewE` ($9.99/year)
- **Account:** brandonhayman.b@gmail.com (test mode)

## Git Commits

- `9bef801` - fix: Update test mock to match StateRule schema
- `80aad0b` - feat: Add deployment infrastructure and landing page comparison
- `8138e38` - test: Add Vitest unit tests for rules engine
- `9b7cb6b` - docs: Update CLAUDE.md with deployment progress
- `19590a0` - chore: Add Prisma seed configuration and populate database
- `a39de35` - feat: Complete Phase 5 - Documentation and Marketing
- `5ca86c0` - feat: Complete Organize My CPE SaaS application
- `38d792f` - Initial commit from Create Next App

## Deploy Commands

```bash
# Vercel (recommended)
vercel deploy --prod

# Railway
railway up

# Docker
docker build -t organize-my-cpe .
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e CLERK_SECRET_KEY="..." \
  -e STRIPE_SECRET_KEY="..." \
  organize-my-cpe
```
