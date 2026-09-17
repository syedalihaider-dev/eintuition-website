# AGENTS.md — eIntuition website

Guidance for AI agents and developers working in this repo.

## What this project is

**eIntuition** marketing / consulting site built on **Next.js 14 App Router** (React 18, Bootstrap, Swiper).

Originally this zip was a **frontend-only** brochure site (pages, components, static assets). It was extended in-place into a **full-stack Next.js app**: same frontend + API routes + Prisma/Postgres + Authorize.net payments + admin UI. There is **no separate backend service** — APIs live under `app/api/`.

## Starting point (what was already here)

- Next.js App Router marketing pages (`app/about`, `services`, `pricing-plan`, etc.)
- Layout, headers/footers, Bootstrap + SCSS under `public/assets`
- Static-style content components under `components/pages/...`
- No DB, no auth, no checkout backend initially

## What was added / changed

### Backend (same Next.js app)

- **Prisma + PostgreSQL** — `prisma/schema.prisma`, `lib/prisma.js`
- Models: `Admin`, `Package`, `Payment`, `ContactQuery`, `QuoteRequest`
- Packages: monthly and yearly are **separate rows** (`billingPeriod` + `priceCents`), not derived yearly from monthly
- Seed: `prisma/seed.js` — admin + 6 packages (Basic/Premium/Enterprise × MONTHLY/YEARLY)
- Default admin (change after go-live): `eintuitionadmin@yopmail.com` / `Admin@123`
- Auth: JWT (`jose`) + bcrypt — cookie/`Bearer` for admin
- Validators: Zod in `lib/validators.js`
- Public APIs: packages, contact, quotes, checkout, checkout success, custom checkout, subscriptions/active, health
- Admin APIs: login/logout/me, password/email, dashboard, packages CRUD, payments, queries, quotes
- Docs: `BACKEND.md`, `DEPLOY-CPANEL.md`, Postman under `postman/`

### Payments

- **Stripe was removed** and replaced with **Authorize.net**
- Checkout uses **Accept.js** (card tokenized in browser → `opaqueData` → server `authCaptureTransaction`)
- Package checkout: `/checkout?packageId=...` → `POST /api/checkout`
- Custom off-platform amount (no package): `/pay` → `POST /api/checkout/custom`
- Discreet footer link “Pay” (low opacity) → `/pay`
- Optional webhook: `POST /api/authorize/webhook` (signature via `AUTHORIZE_SIGNATURE_KEY`)
- Earnings / admin payments: successful Authorize.net charges (`Payment.status = SUCCEEDED`)
- `Payment.packageId` / `billingPeriod` optional for custom one-time charges; `note` for custom reference

### Frontend integrations

- Pricing loads packages from API; Get Started → checkout
- Contact → `POST /api/contact`; Quote → `POST /api/quotes`
- After package payment success: localStorage subscription helpers (`lib/subscription-storage.js`) so current plan shows on pricing
- Admin UI: `/admin/login`, dashboard, packages, payments, queries, quotes, settings

### Deploy / hosting work

- cPanel + PM2: `ecosystem.config.cjs`, `.htaccess` reverse proxy to Node port
- Shared-host build: `next.config.mjs` sets `experimental.cpus = 1` (avoid `EAGAIN` worker spawn)
- **Base path**: local empty; live subdirectory often `/eintuition`
  - `NEXT_PUBLIC_BASE_PATH` + `basePath` in `next.config.mjs`
  - Helpers: `lib/base-path.js`, `lib/app-url.js`
  - `trailingSlash: true` (LiteSpeed `/eintuition` ↔ `/eintuition/` redirect loop fix)
- Accept.js requires **HTTPS** locally → `npm run dev` uses `--experimental-https` + certs in `certificates/` (`scripts/generate-local-certs.js`)
- Vercel: same Next app (UI + API as serverless); set env in project; usually **no** `/eintuition` base path on root domain

## Stack snapshot

| Area | Choice |
|------|--------|
| Framework | Next.js 14.2.5 App Router |
| UI | React 18, Bootstrap 5, existing theme SCSS |
| DB | PostgreSQL + Prisma 5.22 |
| Payments | Authorize.net Accept.js |
| Admin auth | JWT + bcrypt |
| Process (cPanel) | PM2 `eintuition` |

## Important paths

```
app/                    # pages + api routes
app/api/                # backend
app/admin/              # admin UI
app/checkout/           # package checkout + success
app/pay/                # custom amount payment
components/             # marketing + admin UI pieces
lib/                    # prisma, auth, authorize, accept-js, api clients
prisma/schema.prisma
prisma/seed.js
ecosystem.config.cjs    # PM2
.next.config.mjs
.env.example
BACKEND.md
DEPLOY-CPANEL.md
```

## Environment variables

See `.env.example`. Critical groups:

- `DATABASE_URL` — prefer Supabase **Session pooler**; URL-encode special chars (`@` → `%40`)
- `JWT_SECRET`
- `NEXT_PUBLIC_BASE_PATH` — `""` local / Vercel root; `"/eintuition"` cPanel subdirectory
- `NEXT_PUBLIC_APP_URL` — full public URL (no trailing slash)
- Authorize.net server: `AUTHORIZE_API_LOGIN_ID`, `AUTHORIZE_TRANSACTION_KEY`, `AUTHORIZE_ENVIRONMENT`, optional `AUTHORIZE_SIGNATURE_KEY`
- Accept.js client: `NEXT_PUBLIC_AUTHORIZE_API_LOGIN_ID`, `NEXT_PUBLIC_AUTHORIZE_CLIENT_KEY`, `NEXT_PUBLIC_AUTHORIZE_ENVIRONMENT`

`NEXT_PUBLIC_*` changes require rebuild. Never commit real `.env`.

## Common commands

```bash
npm install
npx prisma db push          # schema only
node prisma/seed.js         # admin + packages only
npm run db:setup            # push + seed
npm run dev                 # HTTPS local (Accept.js)
npm run dev:http            # HTTP only (Accept.js will fail)
npm run build
npm start
# cPanel
pm2 start ecosystem.config.cjs
```

## Agent conventions for this repo

1. **Preserve the existing marketing design system** (Bootstrap theme, components) unless asked to redesign. Do not impose generic AI landing-page aesthetics on brochure pages.
2. Backend stays **Next.js Route Handlers + Prisma** — do not introduce Nest/Express/Mongo unless explicitly requested.
3. Packages: never auto-calculate yearly from monthly; keep separate DB rows.
4. Payments: Authorize.net only (Stripe removed). Prefer Accept.js; Hosted return URLs break on localhost.
5. Base path: do not hardcode `/eintuition` in local defaults; use env + `withBasePath()`.
6. Custom pay (`/pay`) is intentional and discreet — keep it out of main nav.
7. Prefer small, focused diffs; don’t rewrite unrelated theme SCSS.
8. After schema changes: `prisma db push` / generate; remind that Vercel needs matching env + redeploy.
9. Seed migrates **initial** data only (admin + packages), not payments/queries/quotes.

## Known pitfalls

| Issue | Cause / fix |
|-------|-------------|
| Directory listing on `/eintuition` | LiteSpeed serving files; need Node proxy + `.htaccess` / cPanel Node app |
| Home `ERR_TOO_MANY_REDIRECTS` | Trailing slash fight — keep `trailingSlash: true` |
| Build `EAGAIN` on shared host | Node 20, `cpus: 1`, low `NODE_OPTIONS` / `UV_THREADPOOL_SIZE` |
| Accept.js “not loaded correctly” | Must load via `beforeInteractive` Script, not dynamic inject |
| Accept.js “HTTPS required” | Use HTTPS local or live HTTPS |
| Hosted payment localhost return URL | Rejected by Authorize.net — use Accept.js |
| Vercel vs cPanel base path | Vercel root usually empty `BASE_PATH`; cPanel may need `/eintuition` |

## Deploy reminders

- **cPanel:** build on server (or upload `.next`), PM2, match `PORT`, set live `NEXT_PUBLIC_*`, rebuild after public env changes.
- **Vercel:** push this full repo; set env in project Environment Variables; run Prisma against external Postgres (`db push` + seed once); redeploy after env changes.
- Optional Authorize.net webhook URL includes base path when used:  
  `{APP_URL}/api/authorize/webhook`
