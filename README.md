# WedPlan — Wedding Marketplace

**WedPlan** is a full-stack wedding marketplace that connects **customers** who are
planning their special day with **vendors** who offer wedding services
(photography, videography, catering, decoration, venues, makeup, entertainment and
more). An **admin** moderates the platform: reviewing services, managing users and
monitoring transactions.

- 🩷 **Client (this repo):** [Next.js 16](https://nextjs.org/) App Router frontend
- 🩷 **Server (separate repo):** [Express](https://expressjs.com/) + MongoDB REST API

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Environment Variables](#environment-variables)
7. [Running the Project](#running-the-project)
8. [Stripe Webhook Setup (Premium Activation)](#stripe-webhook-setup-premium-activation)
9. [Live Links](#live-links)
10. [Repository Links](#repository-links)
11. [Deployment](#deployment)
12. [Default User Roles](#default-user-roles)

---

## Features

### Public
- Wedding-themed landing page: **Banner**, **Featured Services** (6 approved + active
  services with vendor info), **Service Categories**, **Why Choose WedPlan?**,
  **How WedPlan Works**, all animated with Framer Motion.
- **Browse Services** with search/filter; only `Approved` + `isAvailable` services are
  visible to the public.
- **Service Details** at `/browse-services/[id]` (also available at `/services/[id]`)
  — requires sign-in; shows gallery, pricing, vendor information and booking action.
- Navbar with the WedPlan heart logo and public links: **Home / Browse Services /
  Sign In / Sign Up**; an authenticated profile dropdown (name, image, Dashboard,
  Profile Settings, Logout) that updates immediately on auth changes.
- Global **loading**, **error** and **404 (not-found)** states, plus an
  **/unauthorized** page — no dead links, no blank screens.

### Customer
- Sign up / sign in (email + password, Google) with role-based redirects.
- Book an approved & active service (`/bookingform/[id]`) → real API request with
  server-side validation.
- **My Bookings**: service name & image, vendor info, event date, location, status,
  request date; view details; cancel **only** while the request is still `Pending`
  (ownership is verified server-side — customers cannot cancel other people's bookings).
- Duplicate booking requests are rejected by the server (409).

### Vendor
- **Add Service** with image upload (ImgBB); server enforces the **Free plan limit of
  3 active services** (premium vendors are unlimited).
- **My Services**: list own services only, **availability toggle that persists** and
  reflects immediately on customer pages, **Update** (edit-service form) and Delete.
- **Booking Requests**: Accept / Reject — only `Pending` requests, only for the
  vendor's own services, and never re-processed.
- Dashboard overview with real stats (services, pending requests, accepted bookings,
  current plan) and a **Subscription** page.

### Admin
- **Manage Users**: search / filter, view details, block & unblock (admins cannot be
  blocked; blocked users lose access to protected features).
- **Manage Services**: search / filter, review pending submissions, approve / reject,
  delete, toggle availability.
- **Transactions**: vendor, plan, amount, status and date — **read-only**; payment
  records are created by verified Stripe webhooks and can never be modified.
- Dashboard overview with real platform statistics.

### Security
- **JWT-based auth** on the Express API (`verifyToken`) with `requireRole(...)`
  middleware returning proper **401 / 403** responses.
- Every protected API re-verifies the role **server-side** and re-loads the user from
  the database (role + `isBlocked` are never trusted from the client).
- **Ownership verification** on services, bookings and cancellations.
- Server-side request validation on every write endpoint.
- Blocked users are rejected by the API, by the dashboard guards and cannot create
  new sessions.
- Premium is activated **only** through a verified **Stripe webhook** — never by a
  frontend redirect.
- Admin accounts cannot be self-registered (role is forced server-side on sign-up).

---

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Framework  | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling    | Tailwind CSS v4, shadcn/ui, Radix/Base UI primitives |
| Animation  | Framer Motion |
| Auth       | Better Auth (MongoDB adapter) + JWT exchange with the API |
| Payments   | Stripe Checkout + verified webhook |
| Backend    | Express 5 (separate repository), Node.js |
| Database   | MongoDB Atlas |
| Image Hosting | ImgBB |
| Icons      | Lucide, react-icons |

---

## Project Structure

```
wedplan-client/                 # This repository (frontend)
├── app/
│   ├── (auth)/                 # sign-in, sign-up
│   ├── api/auth/[...all]/      # Better Auth handler
│   ├── api/checkout_sessions/  # Stripe Checkout session creation
│   ├── browse-services/        # public list + [id] details
│   ├── services/               # alias routes (/services, /services/[id])
│   ├── dashboard/
│   │   ├── page.tsx            # role-based redirect
│   │   ├── admin/              # users, services, transactions
│   │   ├── customer/           # overview, bookings, profile
│   │   └── vendor/             # overview, add/my/edit services, bookings, subscription
│   ├── bookingform/[id]/       # booking request form
│   ├── checkout/               # checkout + success
│   ├── payment/                # payment status page
│   ├── profile-settings/
│   ├── not-found.tsx  error.tsx  loading.tsx  unauthorized/
│   └── ...
├── components/                 # navbar, footer, home sections
├── lib/                        # auth config, API/action helpers, guards
└── public/

wedplan-server/                 # Separate repository (backend)
├── index.js                    # Express app: auth, roles, bookings, services,
│                               # transactions, Stripe webhook
└── .env.example
```

---

## Prerequisites

- **Node.js 20+** and npm
- A **MongoDB Atlas** account (or a local MongoDB instance)
- A **Stripe** account (test mode is fine)
- An **ImgBB** API key
- (Optional) Google OAuth credentials for Google sign-in

---

## Installation

Clone **both** repositories and install dependencies:

```bash
# Frontend
git clone https://github.com/<YOUR_USERNAME>/wedplan-client.git
cd wedplan-client
npm install
cp .env.example .env        # then fill in the values

# Backend (separate repository)
git clone https://github.com/<YOUR_USERNAME>/wedplan-server.git
cd wedplan-server
npm install
cp .env.example .env        # then fill in the values
```

---

## Environment Variables

### Client — `wedplan-client/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Express API base URL | `http://localhost:8000` |
| `BUTTER_AUTH_DB_URL` | MongoDB connection string used by Better Auth | `mongodb+srv://user:pass@cluster/wedplan` |
| `BETTER_AUTH_SECRET` | Better Auth signing secret | long random string |
| `BETTER_AUTH_URL` | Frontend URL (must match the API's `BETTER_AUTH_URL`) | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client id (optional) | `xxxx` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret (optional) | `xxxx` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_xxx` |
| `STRIPE_PRICE_ID` | Price ID for the premium plan | `price_xxx` |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB key for profile image uploads | `xxxx` |

### Server — `wedplan-server/.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_USER` / `DB_PASSWORD` | MongoDB Atlas credentials | `user` / `pass` |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB key for service image uploads | `xxxx` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_xxx` |
| `JWT_SECRET` | Secret used to sign/verify API JWTs | long random string |
| `BETTER_AUTH_URL` | Frontend URL used to verify Better Auth session tokens | `http://localhost:3000` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_xxx` |
| `CLIENT_URL` | Frontend URL | `http://localhost:3000` |
| `PORT` | API port | `8000` |

> ⚠️ **Never commit real secrets.** Both `.gitignore` files exclude `.env`.

---

## Running the Project

Start the **backend first**, then the **frontend** — in two terminals:

```bash
# Terminal 1 — API (http://localhost:8000)
cd wedplan-server
npm start

# Terminal 2 — Frontend (http://localhost:3000)
cd wedplan-client
npm run dev
```

Production build:

```bash
cd wedplan-client
npm run build
npm run start
```

Useful checks:

```bash
cd wedplan-client && npm run typecheck   # TypeScript check
cd wedplan-server && node --check index.js  # Syntax check
```

---

## Stripe Webhook Setup (Premium Activation)

Premium access is activated **only** by a verified Stripe webhook event
(`checkout.session.completed`) received by `POST /stripe/webhook` on the API —
a frontend redirect can never grant premium.

**Local development:**

```bash
stripe listen --forward-to localhost:8000/stripe/webhook
```

Copy the printed signing secret into `wedplan-server/.env`:

```
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

**Production:** add a webhook endpoint in the Stripe dashboard
(`https://<your-api-domain>/stripe/webhook`) with the event
`checkout.session.completed` and copy its signing secret into `.env`.

Flow: checkout → Stripe success page → `POST /payments/checkout-verify` records the
transaction (idempotent) → webhook verifies the signature and activates premium.

---

## Live Links

| | Link |
|--|------|
| 🌐 Live Client | _<https://your-live-client.vercel.app>_ *(replace after deployment)* |
| 🌐 Live API | _<https://your-live-api.onrender.com>_ *(replace after deployment)* |

---

## Repository Links

| Repository | URL |
|------------|-----|
| 🖥️ Client (frontend) | https://github.com/<YOUR_USERNAME>/wedplan-client |
| ⚙️ Server (backend)  | https://github.com/<YOUR_USERNAME>/wedplan-server |

---

## Deployment

### Frontend (Vercel)

1. Push `wedplan-client` to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add every variable from the [Environment Variables](#environment-variables)
   table in **Project → Settings → Environment Variables**
   (set `BETTER_AUTH_URL` and `NEXT_PUBLIC_API_BASE_URL` to the deployed URLs).
4. Deploy — no extra config is required (Next.js is detected automatically).

### Backend (Render / Railway / Vercel)

1. Push `wedplan-server` to GitHub.
2. Create a **Web Service** running `npm start`.
3. Add the server environment variables, especially:
   - `JWT_SECRET`
   - `BETTER_AUTH_URL` = the deployed **frontend** URL
   - `STRIPE_WEBHOOK_SECRET`
   - `CLIENT_URL` = the deployed frontend URL
4. Update the Stripe dashboard webhook endpoint to the deployed API URL.
5. Update the frontend `NEXT_PUBLIC_API_BASE_URL` to the deployed API URL.

### Database

MongoDB Atlas: create a free cluster, allow access from anywhere (or your IP),
create a database user, and use the connection string in
`BUTTER_AUTH_DB_URL` (client) and `DB_USER`/`DB_PASSWORD` (server).

---

## Default User Roles

| Role | Capabilities |
|------|--------------|
| `customer` | Browse services, book services, manage own bookings |
| `vendor` | Add/update own services, availability toggle, accept/reject booking requests, subscribe to premium |
| `admin` | Manage users (block/unblock), review/approve/reject/delete services, view read-only transactions |

> Admin accounts are **not** creatable through public registration —
> promote a user to `admin` directly in the database.

---

Made with 💗 for couples and vendors worldwide.
