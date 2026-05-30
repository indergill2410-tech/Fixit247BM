# Fixit247BM — Production Setup Checklist

Follow these steps in order before deploying to Render.

---

## 1. Supabase Project

1. Use the existing Fixit247BM Supabase production project:
   - Project ref: `ropgwnprmfisbrkqkhxd`
   - Project URL: `https://ropgwnprmfisbrkqkhxd.supabase.co`
   - Region: **ap-south-1 (Mumbai)**
   - Repository link: `indergill2410-tech/Fixit247BM`
   - Do not reuse Supabase project refs from Carelink or any other product.
2. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon / public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT Secret` (under Auth settings) → `SUPABASE_JWT_SECRET`
3. Go to **Authentication → Providers → Google** — enable and add OAuth credentials
4. Go to **Authentication → Email Templates** — customise with Fixit247 branding
5. Go to **Database → Extensions** — enable:
   - `postgis`
   - `uuid-ossp`
   - `pg_trgm`
6. Under **Project Settings → Database**, copy:
   - Pooled connection string (port 6543) → `DATABASE_URL` (append `?pgbouncer=true&connection_limit=1`)
   - Direct connection string (port 5432) → `DIRECT_URL`
7. Link the local Supabase CLI only to this project:
   - `SUPABASE_ACCESS_TOKEN=<token> npx supabase link --project-ref ropgwnprmfisbrkqkhxd`
   - The CLI link requires `supabase login` or `SUPABASE_ACCESS_TOKEN`; do not link this repo to another project.
8. Deploy database changes in this order:
   - Prisma schema migrations: `pnpm --filter @fixit247/database exec prisma migrate deploy`
   - Supabase SQL migrations: apply files from `supabase/migrations` in filename order.
   - Verify RLS with `scripts/verify-rls.sh` against `https://ropgwnprmfisbrkqkhxd.supabase.co`.

---

## 2. Stripe

1. Create/login at https://stripe.com — switch to **Live mode** for production
2. Go to **Developers → API Keys** and copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
3. Create **Products** (Products → Add product):
   | Product | Price | Interval |
   |---|---|---|
   | Tradie Professional | $99 AUD | Monthly |
   | Tradie Elite | $199 AUD | Monthly |
   | Fixit Plus Home | $29 AUD | Monthly |
   | Fixit Plus Total | $49 AUD | Monthly |
4. Note each **Price ID** — update `packages/payments/src/subscriptions.ts` with live Price IDs
5. Enable **Stripe Connect** (Connect → Get started → Standard accounts)
6. Register webhook: **Developers → Webhooks → Add endpoint**
   - URL: `https://[your-domain]/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `account.updated`
   - Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 3. Resend (Email)

1. Create account at https://resend.com
2. Add and verify your sending domain (`fixit247.com.au`)
3. Create an API key → `RESEND_API_KEY`
4. Test with: `curl -X POST https://api.resend.com/emails -H "Authorization: Bearer $RESEND_API_KEY" -d '{"from":"noreply@fixit247.com.au","to":["test@example.com"],"subject":"Test","html":"<p>It works!</p>"}'`

---

## 4. OpenAI

1. Create API key at https://platform.openai.com/api-keys
2. Copy → `OPENAI_API_KEY`
3. Ensure billing is set up (GPT-4o is used for job scope analysis)

---

## 5. Twilio (Voice Booking)

1. Create account at https://twilio.com
2. Buy an Australian phone number (prefix +61)
3. Copy from console:
   - Account SID → `TWILIO_ACCOUNT_SID`
   - Auth Token → `TWILIO_AUTH_TOKEN`
   - Phone number → `TWILIO_PHONE_NUMBER`
4. After deploying, set the inbound webhook on the number:
   - Voice → Webhook → `https://[domain]/api/voice/twilio/inbound`

---

## 6. Google Maps (Optional — location autocomplete)

1. Create project at https://console.cloud.google.com
2. Enable **Maps JavaScript API** and **Places API**
3. Create API key → `NEXT_PUBLIC_GOOGLE_MAPS_KEY`
4. Restrict to your domain in production

---

## 7. Upstash Redis (Rate limiting + job queues)

1. Create database at https://upstash.com — region: **ap-southeast-1**
2. Copy REST URL → `UPSTASH_REDIS_REST_URL`
3. Copy REST Token → `UPSTASH_REDIS_REST_TOKEN`

---

## 8. Sentry (Error monitoring)

1. Create project at https://sentry.io — platform: Next.js
2. Copy DSN → `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN`

---

## 9. Render Deployment

1. Connect the `indergill2410-tech/Fixit247BM` repo to Render
2. Render will detect `render.yaml` and provision:
   - `fixit247-web` (web service)
   - `fixit247-admin` (web service)
   - `fixit247-db` (PostgreSQL)
3. In the Render dashboard, set all `sync: false` env vars manually for both services (see `.env.example`)
4. The build command will automatically run `prisma migrate deploy` on each deploy
5. Set **`NEXT_PUBLIC_SITE_URL`** to the actual Render URL first, then update to custom domain

---

## 10. Custom Domain

1. In Render → fixit247-web → Settings → Custom Domain
   - Add `fixit247.com.au` → configure DNS CNAME
2. Add `admin.fixit247.com.au` for the admin service
3. Update `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_APP_URL` env vars to use custom domain
4. Update Supabase → Authentication → URL Configuration → Site URL to `https://fixit247.com.au`
5. Update Stripe webhook URL to `https://fixit247.com.au/api/payments/webhook`

---

## 11. Decommission old 247F service

Once new app is verified live:
1. Render → `247f-api` → Suspend service
2. Render → `247f-frontend` → Suspend service
3. Update DNS to point to new services

---

## Post-Deploy Smoke Tests

Run through each flow manually after first deploy:

- [ ] `/` loads without auth — hero, trade categories, all sections visible
- [ ] `/about`, `/pricing`, `/how-it-works`, `/join-as-tradie`, `/fixit-plus`, `/blog`, `/emergency` all load without auth
- [ ] `/register` → new customer account created, verification email received
- [ ] `/login` → redirects to `/dashboard`
- [ ] Customer: post job → AI scope analysis runs → job created
- [ ] Tradie: register with role=TRADIE → onboarding flow → verification
- [ ] Stripe: create test payment → checkout → escrow held → release
- [ ] Admin: `/admin` login → all dashboard sections load
- [ ] `/sitemap.xml` returns valid XML with all pages
- [ ] `/robots.txt` returns correct directives
- [ ] `/api/health` returns 200 for both services
