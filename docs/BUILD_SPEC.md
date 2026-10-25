# MONTÈ — E-commerce Rebuild Spec

> Owner decisions recorded 2026-10-25 (these override the spec text below where they differ):
> - **Database: MongoDB** (native driver), not PostgreSQL/Prisma.
> - **Auth: Better Auth** (MongoDB adapter).
> - **Email: Resend.**
> - **Theme: off-white background, black text.**
> - Framework: upgraded to **Next.js 16**.
> - Section 10 defaults accepted.
> - Tooling outcome: see `docs/tooling-report.md`.

## 0. Context

- Existing site: https://www.montedeluxe.com (currently a countdown / waitlist / anniversary-event landing page for "Collection 001", built with Next.js).
- Goal: **remove all current content** (countdown, email waitlist, About, Events/anniversary/Roomly, FAQ, Instagram strip, "The House" section) and replace the site with a real clothing e-commerce store for **MONTÈ** (Port Harcourt, Nigeria). Brand is styled **MONTÈ** (grave accent) everywhere, including the logo alt text, page titles and metadata.
- Design reference: https://www.corteiz.com. Take from it: extremely minimal header, product-first homepage with no intro sections, tight product grid, ALL-CAPS product names, price only (no stars, badges or reviews), a cart drawer, and almost no decoration. Do **not** copy its branding, copy or assets.
- Images come from MONTÈ's Instagram/content archive. The site is a clean frame around the photography. **No** decorative graphics, gradients, background patterns, parallax, scroll-jacking or heavy animation.

### First steps for Claude Code
1. Read the repo: framework version, routing, styling approach, existing components, env handling, deployment target. **Reuse the existing stack** (it appears to be Next.js) unless there is a strong reason not to.
2. Keep and reuse: logo asset (`/images/logo.PNG`), domain config, social links (Instagram `@houseofmonte`, TikTok `@houseofmonte1`), `hello@montedeluxe.com`, favicon/OG setup.
3. Delete the old sections and unused assets/components/dependencies.
4. Do the **tooling setup in Section 11** (skills, plugins, MCP servers, Claude in Chrome) before writing UI code.
5. Write a short plan (data model, routes, phases) and wait for approval before large changes.

## 1. Recommended stack (adjust to what the repo already uses)

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router), TypeScript, Server Components + Server Actions / Route Handlers |
| Styling | Tailwind CSS, a single neutral palette, one typeface family |
| Database | PostgreSQL (Neon / Supabase / Railway) via Prisma — **overridden: MongoDB** |
| Auth | Auth.js (NextAuth) or Clerk: email + password, Google sign-in optional, password reset by email. Roles: `CUSTOMER`, `ADMIN` — **overridden: Better Auth** |
| Payments | **Paystack** (NGN) |
| Image storage | Cloudinary (or S3 + CloudFront / UploadThing). Serve via `next/image` with responsive sizes |
| Email | Resend (order confirmation, password reset, application received) |
| Validation | Zod on every server boundary |
| Hosting | Vercel (or the repo's current host) |

## 2. Design system

- **Palette:** off-white or black background, black or white text. One accent at most, used only for the sold-out state and errors. Support whichever single theme fits the photography; do not build a theme toggle.
- **Type:** one clean grotesk (e.g. Inter / Helvetica Now alternative). ALL-CAPS for nav and product names, small tracking. Sizes: tiny for meta, normal for body. No display fonts.
- **Layout:** full-bleed images, generous but tight spacing, no cards, no shadows, no rounded corners, no borders except hairlines where needed.
- **Motion:** only (a) cart drawer slide, (b) second image fade on product-tile hover (desktop), (c) subtle opacity on hover. Respect `prefers-reduced-motion`.
- **Mobile first.** Most traffic will be Instagram → phone. Large touch targets, 2-column grid on mobile, sticky Add to Cart on the product page.
- **Performance:** LCP image prioritised, `next/image` with `sizes`, blur placeholders, AVIF/WebP. Target Lighthouse mobile ≥ 90.
- **Accessibility:** real alt text from admin (default: product name + "worn by model"), visible focus states, keyboard-operable drawer and size selector.

## 3. Storefront

### 3.1 Header / navigation
Extremely simple. Left to right:

```
MONTÈ (logo, prominent, links home)     SHOP     EVENT     CART (n)
```

- Logo is large and centered or left-aligned at the top; navigation stays on one quiet row below or beside it. On mobile: logo on top, the three links in one row beneath.
- `EVENT` is visible in the top navigation area and leads to `/face-of-monte`. Nothing else is called "Event" on the site.
- `CART (n)` opens the cart drawer. Account is reachable by a small `ACCOUNT` / `LOGIN` link in the footer and in the cart drawer; do not clutter the primary nav.

### 3.2 Homepage `/`
- No hero text, no countdown, no brand story, no "about" section.
- The first thing visible below the header is **clothing**: a large editorial grid of the latest products (from the active collection, newest first).
- Each tile: large model image (portrait 4:5), product name (caps), price directly underneath. On desktop hover, swap to the second image. Sold-out items show `SOLD OUT` in place of price (still visible, not hidden).
- Grid: 1 column wide editorial on mobile option or 2 columns; 3-4 columns on desktop. Admin can pin/sort products w `sortOrder` field.
- Minimal footer: Instagram, TikTok, email, Shipping & Returns, Terms, Privacy, ©.

### 3.3 Shop `/shop`
- Same grid as home, all products.
- Collection switcher as plain text links (e.g. `ALL / COLLECTION 001 / ...`), driven by the `Collection` table. No filters sidebar. Optional simple category text filter later.

### 3.4 Product page `/shop/[slug]`
- Large image gallery: vertical stack of full-width images on desktop (editorial feel) with thumbnails or swipe on mobile. Images ordered by admin: front, back, detail, styled/model shots.
- **Colour selector** (if the product has multiple colours): switching colour swaps the whole gallery and updates available sizes. Colour is shown as text (e.g. `BLACK`), optionally with a small swatch.
- Product name, price (₦, formatted `₦45,000`), size selector (buttons; out-of-stock sizes crossed out and not selectable), `ADD TO CART`, availability line (`IN STOCK` / `LOW STOCK — 2 LEFT` / `SOLD OUT`).
- Product details (accordion or plain text): description, fabric & care, fit/size guide, shipping & returns summary.
- If the selected colour+size is out of stock: disable the button and show `SOLD OUT`. Optional "Notify me" email capture later.
- SEO: unique title/description, Product JSON-LD with `offers.availability`, OG image from first photo.

### 3.5 Cart
- **Drawer** from the right, opened by `CART`, plus a full `/cart` page (same data) for fallback.
- Line items: thumbnail, name, colour / size, quantity stepper (+/-), remove, line price. Subtotal. `CHECKOUT` button. Note: "Shipping calculated at checkout."
- Cart persisted in localStorage for guests and in the DB for logged-in users; merged on login.
- Server re-validates prices and stock at every cart read and at checkout. Never trust client prices.

### 3.6 Checkout `/checkout`
- Single page: contact email, phone, shipping address (name, street, city, state with a Nigerian-states dropdown, country default Nigeria, optional postal code), delivery method, order summary.
- **Guest checkout allowed**; logged-in users get saved addresses. Offer "Create account after payment".
- Shipping fee: admin-configurable rules (flat rate per state / zone, free-over threshold). International shipping: configurable, can start disabled.
- Pay with **Paystack** (see section 5). Currency NGN.
- Confirmation page `/order/[orderNumber]` + confirmation email.

### 3.7 Accounts
- `/account/login`, `/account/register`, `/account/forgot-password`, `/account/reset-password`.
- `/account`: profile, saved addresses, order history with statuses, order detail.
- Email verification recommended before the first order is shown in history; guests' past orders attach to the account by matching verified email.

### 3.8 FACE OF MONTÈ `/face-of-monte`
Campaign-driven page, still image-led. Content is **admin-editable** (Section 4.6), not hard-coded.

Structure, top to bottom:
1. **FACE OF MONTÈ** as the page title, with the strongest campaign image full-bleed.
2. Information block: what it is, what the winner/face receives, timeline (dates).
3. Requirements / eligibility (plain list).
4. How to apply (numbered steps).
5. More campaign visuals (full-width images, no collage effects).
6. **Application form** (if applications are open): full name, age, gender, phone, email, city, Instagram handle, height, short note, 2-5 photo uploads (size/type limited, stored privately). Consent checkbox. Server-side validation, spam protection (Turnstile or honeypot + rate limit), confirmation email.
7. State handling: `OPEN`, `CLOSED`, `COMING SOON` toggle from admin, with closing date.

## 4. Admin panel `/admin`

Protected by role `ADMIN` (middleware + server-side check on every action; never rely on hiding UI). First admin created by seed script from env var `ADMIN_EMAIL`. Plain, fast UI; it does not need to match the storefront aesthetic but should stay clean.

### 4.1 Dashboard
Today / 7-day / 30-day revenue, paid orders count, orders needing fulfilment, low-stock list, latest orders.

### 4.2 Orders
- Table: order number, date, customer, total, payment status, fulfilment status. Search + filters.
- Detail: items (with colour/size), address, contact, Paystack reference, payment channel, amount, fees, timeline of status changes, internal notes.
- Actions: mark `PROCESSING` → `SHIPPED` (tracking number/courier) → `DELIVERED`, `CANCELLED`, `REFUNDED` (record refund; initiate via Paystack API where possible). Email customer on status change.
- Export CSV.

### 4.3 Payments
- List of Paystack transactions: reference, order, amount, status (`PENDING`, `SUCCESS`, `FAILED`, `ABANDONED`, `REFUNDED`), channel, paid-at, raw webhook payload viewable.
- "Re-verify with Paystack" button for stuck pending orders.

### 4.4 Collections
- CRUD: name, slug, description, cover image, `status` (`DRAFT`, `ACTIVE`, `ARCHIVED`), release date, sort order. Multiple collections can be active simultaneously.

### 4.5 Products & stock (core feature)
Product form:
- Name, slug (auto), description, details/fabric/care, base price (NGN), optional compare-at price, collection(s), category/type, status (`DRAFT`/`ACTIVE`/`ARCHIVED`), sort order.
- **Colours (variants of the product):** add any number of colours. Each colour has:
  - Colour name (+ optional hex for swatch)
  - **Image set with ordering and labels**: upload multiple images by drag-and-drop, label each (`FRONT`, `BACK`, `DETAIL`, `MODEL`, `OTHER`), reorder by dragging, set the cover image and alt text, delete.
  - **Sizes and stock**: a grid of sizes (XS, S, M, L, XL, XXL, ONE SIZE, or custom) × quantity. Optional per-size SKU. Optional price override per colour.
- Bulk stock edit screen (all products, all sizes) and low-stock threshold setting.
- Stock adjustments logged (who, when, delta, reason) in `StockMovement`.
- Duplicate product (to speed up colourways).
- Upload pipeline: direct-to-storage signed uploads, client-side type/size check (JPEG/PNG/WebP, ≤ 10 MB each), server-side re-validation, auto-generate responsive sizes.
- Soft delete / archive only; never hard-delete a product that appears in orders.

### 4.6 Face of MONTÈ
- Edit page content (title, intro, requirements, steps, dates), manage campaign images (ordered), open/close applications.
- Applications inbox: list, view photos, status (`NEW`, `SHORTLISTED`, `REJECTED`, `SELECTED`), notes, export CSV, email applicant.

### 4.7 Settings
Shipping zones & rates, free-shipping threshold, store contact info, Paystack mode indicator (test/live; keys stay in env, never in DB), order-number prefix, admin users management.

## 5. Paystack integration (must be done carefully)

Env vars: `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `NEXT_PUBLIC_SITE_URL`.

Flow:
1. Customer submits checkout. **Server** recomputes line prices, shipping and total from the DB, validates stock, creates `Order` (`PENDING`) with a unique `orderNumber` and **reserves stock** for 15-30 minutes.
2. Server calls Paystack `POST /transaction/initialize` with `email`, `amount` **in kobo** (₦ × 100, integer), unique `reference`, `callback_url`, and `metadata` (orderId, orderNumber). Returns `authorization_url` / `access_code`; redirect the customer (or use Paystack Inline with the access_code).
3. Callback page `/order/verify?reference=…` calls `GET /transaction/verify/:reference` server-side and shows status. **This page is a convenience, not the source of truth.**
4. **Webhook** `POST /api/paystack/webhook` is the source of truth:
   - Verify `x-paystack-signature` = HMAC-SHA512 of the **raw** request body with the secret key (use constant-time comparison). Reject otherwise.
   - Handle `charge.success` (and `refund.processed`, `charge.failed` if useful).
   - **Idempotent:** processing the same reference twice must not double-decrement stock or double-email.
   - On success: confirm `amount` and `currency` match the order, mark order `PAID`, convert reservation into a stock decrement, send confirmation email.
   - Always return 200 quickly after persisting; do heavy work after.
5. Cron/job: release expired reservations, mark old `PENDING` orders `EXPIRED`, re-verify pending references.
6. Oversell protection: decrement stock inside a DB transaction with a conditional update (`WHERE stock >= qty`). If it fails after payment, flag the order `NEEDS_ATTENTION` and notify admin.
7. Test with Paystack test keys and the test cards, including: success, declined, abandoned, duplicate webhook, tampered amount, forged signature.

## 6. Data model (Prisma-style outline — implemented as MongoDB collections)

```
User            id, email (unique), name, phone, passwordHash?, role (CUSTOMER|ADMIN), emailVerifiedAt, createdAt
Address         id, userId?, name, phone, line1, line2?, city, state, country, postalCode?
Collection      id, name, slug, description, coverImageUrl, status, releaseDate, sortOrder
Product         id, name, slug, description, details, price (int, kobo), compareAtPrice?, status, sortOrder, createdAt
ProductCollection  productId, collectionId
ProductColor    id, productId, name, hex?, priceOverride?, sortOrder
ProductImage    id, productColorId, url, publicId, kind (FRONT|BACK|DETAIL|MODEL|OTHER), alt, sortOrder
Variant         id, productColorId, size, sku?, stock (int), reserved (int), lowStockThreshold?
StockMovement   id, variantId, delta, reason, actorId?, createdAt
Cart / CartItem id, userId?|sessionId, variantId, quantity
Order           id, orderNumber, userId?, email, phone, shippingAddress (json), subtotal, shippingFee, total (kobo),
                currency, paymentStatus, fulfilmentStatus, trackingNumber?, courier?, notes, createdAt
OrderItem       id, orderId, variantId, nameSnapshot, colorSnapshot, sizeSnapshot, imageSnapshot, unitPrice, quantity
Payment         id, orderId, provider ('paystack'), reference (unique), amount, status, channel, paidAt, raw (json)
ShippingRule    id, name, states[]|country, fee, freeOverAmount?
FaceOfMonte     id (singleton), status, title, intro, requirements, steps, closesAt, content (json)
FaceImage       id, url, alt, sortOrder
FaceApplication id, fullName, age, gender, phone, email, city, instagram, height, note, photos[] (private), status, adminNotes, createdAt
AuditLog        id, actorId, action, entity, entityId, meta, createdAt
```

Store money as **integers in kobo**. Snapshot product name/price/image on `OrderItem` so later edits don't rewrite history.

## 7. Security & quality

- Server-side validation (Zod) for every form/route; authorise every admin action; CSRF-safe actions; secure cookies; rate-limit login, register, apply, checkout.
- Never log secrets or full card data (Paystack handles cards; none touches our server).
- Private bucket / signed URLs for Face of MONTÈ applicant photos.
- Hash passwords with argon2/bcrypt (or use a provider); enforce reasonable password rules.
- Sanitise any admin-entered rich text; prefer plain text with line breaks.
- Basic privacy policy and terms pages (Nigerian NDPR-aware wording) and a cookie notice only if analytics require it.
- Tests: unit tests for price/shipping/stock logic and webhook signature check; e2e (Playwright) for browse → add to cart → checkout (Paystack test mode) → admin sees paid order.
- Error and empty states for everything (empty cart, no products, payment failed, sold out).

## 8. Content & migration notes

- Old routes (`/`, any `#events` anchors) are replaced; add redirects for any old URLs that were indexed.
- Update metadata: title `MONTÈ`, description focused on the clothing label, remove "Collection 001 drops July 22" and anniversary event copy.
- Remove the Roomly partnership block and the mailing-list/waitlist form unless the owner wants to keep a footer newsletter signup (ask). — **Owner: no newsletter.**
- Seed script: 1 collection, 3 sample products with 2 colours and 3-4 sizes each using placeholder images, plus 1 admin user, so the UI can be demoed before real photos are uploaded.
- Product photography is uploaded later by the team through the admin panel; do not hotlink Instagram images.

## 9. Delivery phases

0. **Tooling:** Section 11 (inventory, install missing tools, DESIGN.md, CLAUDE.md rules, verify triggers).
1. **Foundation:** repo audit, strip old site, design tokens, header/footer, DB + auth + roles, seed data.
2. **Catalogue:** collections/products/colours/images/stock in admin; storefront home, shop, product page.
3. **Cart & checkout:** drawer + page, shipping rules, Paystack init/verify/webhook, order creation, emails, confirmation page.
4. **Accounts:** register/login/reset, order history, saved addresses, cart merge.
5. **Admin operations:** orders, payments, dashboard, stock movements, CSV export.
6. **Face of MONTÈ:** public page, admin editor, application form + inbox.
7. **Hardening:** tests, Lighthouse/a11y pass, security review, redirects, SEO, go-live checklist (live Paystack keys, webhook URL registered in Paystack dashboard, domain, email domain verification).

## 10. Decisions to confirm with the owner (defaults in brackets — all defaults accepted)

- Guest checkout allowed? [yes]
- International shipping at launch? [no, Nigeria only]
- Single currency NGN? [yes]
- Display product price with or without VAT note? [price as entered]
- Newsletter signup in footer? [no]
- Delivery partners / courier integration (GIG, DHL, etc.) or manual tracking numbers? [manual]
- Does Face of MONTÈ application have a fee? [no]
- Pre-orders / drop scheduling (product visible but purchasable from a set time)? [not in v1]

## 11. Tooling, skills and browser setup

Completed in Phase 0 — see `docs/tooling-report.md`. Ongoing rules that still apply:

### 11.7 Browser verification loop (Claude in Chrome + Playwright)
After every UI milestone, Claude must **look at the running app**, not just read code:
1. Start the dev server. Open it in Chrome via Claude in Chrome (or `playwright-cli open http://localhost:3000 --headed`).
2. Walk the flows: home → product → choose colour/size → add to cart → drawer (quantity, remove) → checkout (Paystack **test mode**) → order confirmation → account → admin (add product with multiple colours/images, adjust stock, see the order and payment) → Face of MONTÈ (page and application).
3. Check widths **375, 768, 1280, 1536**, loading/empty/sold-out/error states, hover swap, keyboard focus, console errors, failed network requests, broken images, layout shift.
4. Screenshot each step, list defects with evidence, fix them, re-run.
5. Run web-design-guidelines on the changed files and Lighthouse (mobile) on `/`, `/shop/[slug]`, `/checkout`.
6. Use a **local or staging** environment and test accounts. Never paste passwords into prompts; read them from a gitignored `.audit/.env` with values in single quotes. Never run these flows against live payments.

For repeatable regression checks, save the key flows as Playwright tests (`tests/e2e`) so they run in CI.

### 11.8 Order of work for the frontend
1. Tokens/theme and base components (header, tile, gallery, drawer, buttons, forms).
2. Pages one at a time: home → shop → product → cart/checkout → account → Face of MONTÈ → admin.
3. After each page: browser verification (11.7), web-design-guidelines, fix, then `/clear` before the next page to keep context lean.
4. Final pass: accessibility, performance, SEO, then the redesign/audit skill once over the whole site.
