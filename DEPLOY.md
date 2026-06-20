# Aharrie Strategy — Next.js Deployment Guide

One repo. One deployment. Everything on Vercel.

---

## Step 1 — Set up Supabase (5 minutes)

1. Go to **supabase.com** → New project → name it `aharrie-strategy`
2. Once created: **Database → SQL Editor → New query**
3. Paste the contents of `app/db/schema.sql` and click **Run**
4. Go to **Settings → API** and copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_KEY`

---

## Step 2 — Deploy to Vercel (5 minutes)

1. Push this repo to GitHub
2. Go to **vercel.com** → New Project → Import from GitHub
3. Vercel auto-detects Next.js — no config needed
4. Under **Environment Variables**, add:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
JWT_SECRET=your_min_32_char_random_secret_here
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

5. Click **Deploy** — done ✅

Every push to `main` auto-deploys. No Railway needed. No separate backend.

---

## Step 3 — Test locally

```bash
git clone <your-repo>
cd aharrie-strategy
npm install
cp .env.example .env.local
# Fill in .env.local with your Supabase keys
npm run dev
```

Open http://localhost:3000

---

## Project Structure

```
app/
  page.tsx                    ← Landing page (/)
  role/page.tsx               ← Choose Your Role (/role)
  guest/page.tsx              ← Guest home (/guest)
  subscription/page.tsx       ← Subscription plans (/subscription)
  (auth)/
    login/patient/page.tsx    ← Patient login
    login/pharmacist/page.tsx ← Pharmacist login
  (app)/
    home/page.tsx             ← Patient dashboard
    dashboard/page.tsx        ← Pharmacist dashboard
    scan/page.tsx             ← QR scanner
    result/page.tsx           ← Verification result
    manual/page.tsx           ← Manual batch lookup
    report/page.tsx           ← Report fake drug
    history/page.tsx          ← Scan history
    pharmacies/page.tsx       ← Find pharmacies
    account/page.tsx          ← Account & settings
    analytics/page.tsx        ← Pharmacist analytics
    dispensing/page.tsx       ← Dispensing log
  api/
    auth/register/route.ts    ← POST /api/auth/register
    auth/login/route.ts       ← POST /api/auth/login
    auth/me/route.ts          ← GET  /api/auth/me
    auth/subscribe/route.ts   ← POST /api/auth/subscribe
    verify/route.ts           ← GET  /api/verify?code=
    verify/batch/route.ts     ← POST /api/verify/batch
    verify/history/route.ts   ← GET  /api/verify/history
    reports/route.ts          ← POST /api/reports
    reports/mine/route.ts     ← GET  /api/reports/mine
    reports/all/route.ts      ← GET  /api/reports/all
    pharmacies/route.ts       ← GET  /api/pharmacies
    pharmacies/[id]/route.ts  ← GET  /api/pharmacies/:id
  db/
    schema.sql                ← Paste into Supabase SQL editor
lib/
  auth.ts                     ← Register, login, JWT helpers
  verification.ts             ← Drug lookup (Supabase + local fallback)
  reports.ts                  ← Create & fetch reports
  supabase.ts                 ← Supabase client
  jwt.ts                      ← Sign & verify JWT
  AuthContext.tsx             ← Auth state for the whole app
  api.ts                      ← Typed fetch client for all API calls
types/index.ts                ← All TypeScript types
middleware.ts                 ← Route protection (JWT guard)
components/ui/               ← Shared UI components
```

---

## Enable real QR scanning

```bash
npm install html5-qr-code
```

Then in `app/(app)/scan/page.tsx`, uncomment the `Html5Qrcode` block at the top.

QR codes should encode: `NAFDAC_NO-BATCH_NO`
Example: `04-3275-CTBN-240601`

---

## API Reference

| Method | Endpoint                | Auth       | Description                    |
|--------|-------------------------|------------|--------------------------------|
| POST   | `/api/auth/register`    | None       | Create account                 |
| POST   | `/api/auth/login`       | None       | Login, returns JWT             |
| GET    | `/api/auth/me`          | JWT        | Get current user               |
| POST   | `/api/auth/subscribe`   | JWT        | Set subscription plan          |
| GET    | `/api/verify?code=`     | Optional   | Verify drug by QR code         |
| POST   | `/api/verify/batch`     | Optional   | Verify by NAFDAC + batch no.   |
| GET    | `/api/verify/history`   | JWT        | Get user's scan history        |
| POST   | `/api/reports`          | JWT        | Submit fake drug report        |
| GET    | `/api/reports/mine`     | JWT        | Get user's reports             |
| GET    | `/api/reports/all`      | Pharmacist | Get all reports (paginated)    |
| GET    | `/api/pharmacies`       | None       | List pharmacies                |
| GET    | `/api/pharmacies/:id`   | None       | Get single pharmacy            |

---

## Go-live checklist

- [ ] Supabase schema created and tested
- [ ] All 5 env variables set in Vercel
- [ ] Vercel deployment green
- [ ] Test register → login → scan → verify → report flow end-to-end
- [ ] Enable real QR scanner (html5-qr-code)
- [ ] Add custom domain in Vercel → Settings → Domains
