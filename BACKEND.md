# Backend API reference (no frontend wiring yet)

## Postman
Import both files from `/postman`:
- `eIntuition-Backend.postman_collection.json`
- `eIntuition-Local.postman_environment.json`

Suggested order: Health → List Packages → Login → Dashboard → Contact/Quotes → Checkout → Admin lists.

## Admin panel (UI)
- Login: `/eintuition/admin/login`
- Dashboard: `/eintuition/admin`
- Packages / Payments / Queries / Quotes / Settings under `/eintuition/admin/...`

Base path: empty locally; on live set `NEXT_PUBLIC_BASE_PATH=/eintuition`.

## Public
- `GET /api/health` — DB health check
- `GET /api/packages` — active packages (`?billingPeriod=MONTHLY|YEARLY`)
- `GET /api/packages/:id` — by id or slug
- `POST /api/contact` — create contact query
- `POST /api/quotes` — create quote request
- `POST /api/checkout` — create Authorize.net Accept Hosted token
- `GET /api/checkout/success?payment_id=` — verify payment + mark SUCCEEDED
- Pages: `/checkout?packageId=...`, `/checkout/success?payment_id=...`
- `POST /api/authorize/webhook` — Authorize.net webhooks (optional signature)

## Admin (Bearer token or cookie from login)
- `POST /api/admin/auth/login` — `{ email, password }` → token
- `POST /api/admin/auth/logout`
- `GET /api/admin/auth/me`
- `POST /api/admin/auth/change-password` — `{ currentPassword, newPassword }`
- `PATCH /api/admin/auth/update-email` — `{ email }`
- `GET /api/admin/dashboard` — earnings + query/quote counts
- `GET /api/admin/packages`
- `POST /api/admin/packages` — create
- `GET|PATCH|DELETE /api/admin/packages/:id` — DELETE soft-deactivates
- `GET /api/admin/payments?status=&limit=&offset=`
- `GET /api/admin/queries?status=&limit=&offset=`
- `GET|PATCH /api/admin/queries/:id` — `{ status }`
- `GET /api/admin/quotes?status=&limit=&offset=`
- `GET|PATCH /api/admin/quotes/:id` — `{ status }`

## Setup
1. Copy `.env.example` → `.env` and set `DATABASE_URL` + `JWT_SECRET`
2. Prefer Supabase **Session pooler** URI (IPv4-friendly)
3. URL-encode special chars in DB password (`@` → `%40`)
4. Add Authorize.net sandbox keys when ready
5. `npm run db:setup` (push schema + seed admin/packages)

Seeded packages match current frontend pricing as **6 separate records**:
- Monthly: Basic $29, Premium $69, Enterprise $89
- Yearly: Basic $82, Premium $113, Enterprise $187

Filter: `GET /api/packages?billingPeriod=MONTHLY` or `YEARLY`.
Checkout uses the selected package's own `priceCents` + `billingPeriod` (no price calculation).

Admin: `eintuitionadmin@yopmail.com` / `Admin@123`

## Authorize.net webhook (optional)
Endpoint: `/api/authorize/webhook`

Useful events:
- `net.authorize.payment.authcapture.created`
- `net.authorize.payment.refund.created`

Set `AUTHORIZE_SIGNATURE_KEY` if you enable signature verification in the merchant dashboard.
