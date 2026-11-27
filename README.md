# WedPlan — Wedding Marketplace

**WedPlan** is a full-stack wedding marketplace that connects **customers** who are
planning their special day with **vendors** who offer wedding services
(photography, videography, catering, decoration, venues, makeup, entertainment and
more). An **admin** moderates the platform: reviewing services, managing users and
monitoring transactions.

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

## Live Links

| | Link |
|--|------|
| 🌐 Live Client | _<https://your-live-client.vercel.app>_ *(replace after deployment)* |
| 🌐 Live API | _<https://your-live-api.onrender.com>_ *(replace after deployment)* |

---

Made with 💗 for couples and vendors worldwide.
