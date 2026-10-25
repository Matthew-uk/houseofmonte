---
name: monte-store
description: Rules for the MONTÈ store's backend and commerce logic — MongoDB models, products/colours/variants/stock, cart pricing, checkout, orders, Paystack payments and webhooks, Better Auth roles, admin actions, emails via Resend, Cloudinary uploads, Face of MONTÈ applications. Use whenever writing or reviewing server code, route handlers, server actions, data models, payment or stock logic, or admin features in this repo.
---

# MONTÈ store — engineering rules

Stack: Next.js App Router (TypeScript) · MongoDB (native `mongodb` driver via `lib/db.ts`) · Better Auth (MongoDB adapter, `role`: `CUSTOMER` | `ADMIN`) · Paystack (NGN) · Resend · Cloudinary · Zod · Tailwind v4.

> This skill is a living document. Update it when the real code establishes a pattern (file paths, helper names).

## Precedence
Payment, security and stock correctness beat brevity and design polish. When unsure, read `references/payments.md` and confirm the library API with `ctx7`.

## Data
- Collections and Zod schemas live in `lib/models/<name>.ts`, with one module per collection exporting `schema`, the TS type and a typed `collection()` getter. Data access goes in `lib/services/<name>.service.ts`, never inline in components.
- Indexes are declared in `scripts/indexes.ts`. Required unique indexes: `products.slug`, `collections.slug`, `orders.orderNumber`, `payments.reference`, `user.email`, and the variant SKUs where set.
- **Money is integer kobo** (`number`, `Number.isInteger`). Format only at the edge with `formatNaira(kobo)`. Never use floats for money, and never trust a price from the client.
- Products embed `colors[]`, each with `images[]` and `variants[]` (`{ _id, size, sku?, stock, reserved, lowStockThreshold? }`). Archive products, never hard-delete one that appears in an order.
- Order items snapshot the name, colour, size, image and unit price.
- Every admin mutation writes an `auditLog` entry. Every stock change writes a `stockMovements` entry (`variantId, delta, reason, actorId`).

## Server boundaries
- Every route handler and server action validates its input with Zod `safeParse` and returns typed errors.
- Admin: check `requireAdmin()` server-side in **every** action and route, in addition to the `proxy.ts`/middleware guard. Hiding UI is not authorisation.
- Rate-limit login, register, forgot-password, the application form and checkout (`lib/rate-limit.ts`).
- Never log secrets, full webhook headers, or personal data beyond the order number and email.

## Stock
- Available = `stock - reserved`. Reserve at checkout with an atomic conditional update:
  `updateOne({ _id, "colors.variants._id": vid, ... $expr: available >= qty }, { $inc: { reserved: qty } })`, using array filters, inside `session.withTransaction` when several lines are touched. If any line fails, abort and return `OUT_OF_STOCK` for that line.
- On payment success: `$inc { stock: -qty, reserved: -qty }`, guarded the same way. If it fails, the order becomes `NEEDS_ATTENTION` and the admin is emailed.
- Reservations expire after 30 min (`orders.reservedUntil`). The cron route releases them and marks the order `EXPIRED`.

## Payments
See `references/payments.md`. Summary: the server computes totals, `initialize` is called with kobo and our own reference, `/order/verify` is cosmetic, and the **webhook is the source of truth** (raw body, HMAC-SHA512, `timingSafeEqual`, idempotent, amount and currency checked).

## Auth
- Better Auth email+password, with verification required before guest orders attach to the account. Passwords: minimum 8 characters. The reset link expires after 1 hour.
- The first admin comes from the seed script using `ADMIN_EMAIL`. Roles are changed only by admins, and every change is audit-logged.

## Uploads
- Signed direct-to-Cloudinary uploads. Server-side re-validation of type (jpeg/png/webp) and size (≤ 10 MB).
- Face of MONTÈ applicant photos use `type: "authenticated"`, and only admins see them, through short-lived signed URLs.

## UI
UI follows `DESIGN.md` (see `references/design.md` for the short version).

## Before committing
`npm run lint && npm run typecheck && npm test` (once tests exist). Run `/security-review` for auth, checkout, webhook or admin changes.
