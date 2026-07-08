# MONTÉ — Change Log

Every meaningful change to this project is logged here with date, what changed, and why.

---

## 2026-07-08 — Full waitlist system: MongoDB, admin dashboard, confirmation emails

**Context.** Converted the demo email signup (localStorage-only) into a production waitlist system
backed by MongoDB. Includes a premium admin dashboard, SMTP confirmation emails via Hostinger, a
luxury toast notification system, and secure single-admin authentication — all matching the existing
dark/gold Monte Deluxe design language.

**New dependencies (5).**
- `mongodb` — native driver for subscriber/admin storage
- `nodemailer` + `@types/nodemailer` — SMTP email via Hostinger
- `bcryptjs` — admin password hashing
- `sonner` — lightweight toast notifications (3.5kB, fully customizable)

**Database layer.**
- `lib/db.ts` — MongoDB connection singleton, cached on `globalThis` in dev (HMR-safe), deferred
  connect on first use so builds succeed without a live database URI
- `lib/models/subscriber.ts` — `SubscriberDoc` interface, auto-created indexes (email unique,
  subscribedAt desc, compound status+subscribedAt)
- `lib/validation.ts` — server-side email validation (RFC 5321 length, injection prevention)
- `lib/rate-limit.ts` — in-memory sliding-window rate limiter with periodic cleanup

**API routes (7 endpoints).**
- `POST /api/subscribe` — public signup: validates, rate-limits (5/min/IP), inserts into MongoDB,
  fires welcome email (non-blocking), returns `201` (new) or `200` (duplicate, not an error)
- `POST /api/admin/login` — authenticates against bcrypt-hashed admin password, sets HTTP-only
  session cookie; rate-limited to 5/15min/IP
- `POST /api/admin/logout` — clears session cookie
- `GET /api/admin/subscribers` — paginated list with search, sort, date-range filter
- `DELETE /api/admin/subscribers` — bulk delete by IDs
- `DELETE /api/admin/subscribers/[id]` — single delete
- `GET /api/admin/stats` — dashboard stats via `$facet` aggregation (total, today, week, month,
  growth %, recent 5)
- `GET /api/admin/export` — CSV download of all subscribers

**Authentication & security.**
- `lib/auth/session.ts` — HMAC-SHA256 signed session tokens using Web Crypto API (Edge Runtime
  compatible), 24-hour expiration, HTTP-only + secure + SameSite=Lax cookies
- `middleware.ts` — protects `/admin/*` (redirects to login) and `/api/admin/*` (returns 401)
- `scripts/seed-admin.ts` — one-time admin seeder reading from `.env.local`, upserts with bcrypt
  cost-factor 12; run via `npx tsx scripts/seed-admin.ts`
- No JWT, no localStorage auth, no client-side secrets

**Email system.**
- `lib/email/transporter.ts` — Nodemailer SMTP singleton (Hostinger: smtp.hostinger.com:465, SSL)
- `lib/email/templates/welcome.ts` — luxury HTML email: dark `#050505` background, gold `#c9a84c`
  accents, inline CSS for maximum client compatibility, perks list, CTA button, social links,
  footer; matching plaintext version
- `lib/email/send.ts` — fire-and-forget wrapper; email failure never blocks the signup response

**Toast system.**
- `components/ui/Toast.tsx` — Sonner `<Toaster>` with Monte Deluxe aesthetic: glass morphism
  (rgba+backdrop-blur), dark surfaces, gold accents, custom per-variant left-border colors
  (success=gold, error=gold-muted, info=subtle border)
- Integrated into root `app/layout.tsx`

**Frontend changes.**
- `components/sections/EmailSignup.tsx` — replaced localStorage with `POST /api/subscribe`;
  loading spinner during submission; toast notifications for success/duplicate/error; inline
  validation preserved for instant feedback
- `lib/constants.ts` — removed `SIGNUP_STORAGE_KEY` (no longer used)

**Admin dashboard (new).**
- `app/admin/login/page.tsx` — branded login page (dark, centered card, Monte wordmark, noindexed)
- `app/admin/page.tsx` — dashboard overview
- `app/admin/layout.tsx` — shell with sidebar (desktop) / hamburger header (mobile)
- `components/admin/LoginForm.tsx` — email + password form with loading state
- `components/admin/Sidebar.tsx` — fixed sidebar with brand, overview link, logout
- `components/admin/MobileAdminHeader.tsx` — responsive mobile header with dropdown nav
- `components/admin/StatsCards.tsx` — 4 metric cards (total, today, week, month) with animated
  counters and growth percentage indicator
- `components/admin/SubscribersTable.tsx` — full data table: checkbox selection, sortable columns
  (email, date), search, date-range filter, bulk delete, single delete, copy email, row hover,
  skeleton loading, empty state
- `components/admin/SearchBar.tsx` — debounced search with clear button
- `components/admin/DateFilter.tsx` — from/to date inputs with clear
- `components/admin/TablePagination.tsx` — page navigation with showing/total display
- `components/admin/ExportButton.tsx` — CSV download trigger
- `components/admin/EmptyState.tsx` — illustration + message for empty tables
- `components/ui/Spinner.tsx` — gold loading spinner (used in buttons)
- `components/ui/SkeletonCard.tsx` — skeleton loaders for stats cards and table rows
- `hooks/useAdminData.ts` — `useStats()` (auto-refresh 30s) and `useSubscribers()` with full
  param reactivity and abort-controller cleanup
- `hooks/useDebounce.ts` — generic debounce hook (used for search)
- `hooks/useAnimatedCounter.ts` — requestAnimationFrame counter with ease-out cubic

**Environment variables.**
- `.env.example` — committed template with all required vars documented
- `.env.local` — gitignored file with actual values (MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD,
  SESSION_SECRET, SMTP_HOST/PORT/SECURE/USER/PASS, EMAIL_FROM)

**Architecture decisions.**
- Native `mongodb` driver (no Mongoose) — one collection, simple queries, no schema overhead
- HMAC session tokens over JWT — simpler, no library, Edge-compatible
- Fire-and-forget emails — signup response never delayed by SMTP
- Duplicate emails return 200 (not error) — informational toast, never a red error state
- Admin dashboard is fully client-rendered (no SSR needed for admin pages)
- All existing design tokens reused — no new CSS variables added
- All admin components use the same font families, colors, borders, and radius tokens

**Files added (35).**
`.env.example`, `middleware.ts`, `scripts/seed-admin.ts`, `lib/db.ts`, `lib/validation.ts`,
`lib/rate-limit.ts`, `lib/models/subscriber.ts`, `lib/services/subscriber.service.ts`,
`lib/services/auth.service.ts`, `lib/auth/session.ts`, `lib/email/transporter.ts`,
`lib/email/send.ts`, `lib/email/templates/welcome.ts`, `app/api/subscribe/route.ts`,
`app/api/admin/login/route.ts`, `app/api/admin/logout/route.ts`,
`app/api/admin/subscribers/route.ts`, `app/api/admin/subscribers/[id]/route.ts`,
`app/api/admin/stats/route.ts`, `app/api/admin/export/route.ts`,
`app/admin/layout.tsx`, `app/admin/page.tsx`, `app/admin/login/page.tsx`,
`components/ui/Toast.tsx`, `components/ui/Spinner.tsx`, `components/ui/SkeletonCard.tsx`,
`components/admin/LoginForm.tsx`, `components/admin/Sidebar.tsx`,
`components/admin/MobileAdminHeader.tsx`, `components/admin/StatsCards.tsx`,
`components/admin/SubscribersTable.tsx`, `components/admin/SearchBar.tsx`,
`components/admin/DateFilter.tsx`, `components/admin/TablePagination.tsx`,
`components/admin/ExportButton.tsx`, `components/admin/EmptyState.tsx`,
`hooks/useAdminData.ts`, `hooks/useDebounce.ts`, `hooks/useAnimatedCounter.ts`

**Files modified (3).**
`app/layout.tsx` (added `<MonteToaster />`), `components/sections/EmailSignup.tsx` (replaced
localStorage with API + toast), `lib/constants.ts` (removed `SIGNUP_STORAGE_KEY`)

**Verified (2026-07-08).** `npm run lint` — zero errors (1 pre-existing warning in Collection.tsx).
`npm run build` — clean, 16 routes (10 static, 7 dynamic API + middleware). All admin routes
protected by middleware. Admin login page noindexed.

**Setup steps for new environments.**
1. Copy `.env.example` to `.env.local` and fill in all values
2. Run `npx tsx scripts/seed-admin.ts` to create the admin account
3. `npm run dev` — signup form posts to `/api/subscribe`, admin at `/admin/login`

**Known limitations.**
- Rate limiter is in-memory (per-process); resets on serverless cold start
- No email unsubscribe mechanism yet (can be added when needed)
- Admin session is 24h fixed — no sliding window refresh
- CSV export loads all subscribers into memory (fine for <100k rows)

---

## 2026-07-07 — Complete SEO/GEO implementation + carousel page-count fix

**Context.** Full technical-SEO, local-SEO and GEO (AI-search) implementation for the brand as
**Monte Deluxe** (Port Harcourt, Rivers State, Nigeria), per the owner's SEO brief, plus a fix for
the Instagram carousel desync. Canonical domain confirmed with owner: `https://montedeluxe.com`.
Visual wordmark stays `MONTÉ`; "Monte Deluxe" is the search-facing name (schema `alternateName`s:
MONTÉ, Monte).

**Carousel fix** (`sections/Instagram.tsx`). On desktop, 3 tiles share a view, so 6 slides have
only ~4 real scroll positions — but dots/arrows assumed 6: the last dots were unreachable and the
next-arrow never disabled. Now a `pageCount` state derives from the track's true scrollable range
(`(scrollWidth − clientWidth) / step + 1`), kept fresh by a `ResizeObserver` (breakpoint changes
re-count). Dots render per page (labels "Go to slide group N"), `atEnd` uses `pageCount`, the
scroll handler clamps to it, and autoplay wraps on the same number. Mobile still yields 6 pages;
desktop 4.

**SEO/GEO — new files.**

- `lib/seo.ts` — single source of truth: `SITE_URL`, brand names/alternates, title, description,
  keywords, social profiles, and `BUSINESS` info (typed, with TODO placeholders — see below).
- `lib/faq.ts` — 6 brand Q&As (who/where/what/Nigerian?/launch date/how to order), one source for
  both the visible section and the schema so they always match.
- `components/seo/JsonLd.tsx` — one `@graph`: Organization+Brand, logo ImageObject,
  **ClothingStore** (LocalBusiness with PostalAddress, GeoCoordinates, areaServed, priceRange ₦₦₦,
  NGN, sameAs Instagram/TikTok), WebSite, WebPage, BreadcrumbList, FAQPage. Rendered in the root
  layout. Empty placeholder fields (phone, street, founder, hours) are omitted from output until
  filled.
- `components/sections/BrandFaq.tsx` — visible "The House" FAQ section (server component, native
  styled `<details>`/`<summary>`, no client JS) between Instagram and the footer; wired into
  `app/page.tsx`. This is the GEO surface AI engines quote from.
- `app/sitemap.ts`, `app/robots.ts` — sitemap.xml (single route, extensible) and robots.txt
  (allow all, disallow `/_next/`, sitemap + host reference).
- `app/opengraph-image.tsx` — generated 1200×630 OG/Twitter card (dark, gold MONTÉ wordmark,
  "Luxury Fashion — Port Harcourt, Nigeria", Collection 001 date).
- `app/not-found.tsx` — branded, noindexed 404 with a link home.

**SEO/GEO — modified files.**

- `app/layout.tsx` — full Metadata API: `metadataBase`, title default+template, description,
  keywords, authors/creator/publisher, applicationName, category, canonical, robots (+googleBot
  `max-image-preview:large` etc.), icons, formatDetection, OpenGraph (locale `en_NG`), Twitter
  `summary_large_image`, commented `verification` TODOs; `viewport` export with
  `themeColor #050505` (Next 15 requires viewport outside `metadata`).
- `components/sections/Hero.tsx` — hero background converted from CSS `background-image` to
  `next/image fill + priority + sizes="100vw"` (LCP now preloaded/optimized); emblem logo gets
  `priority` + `sizes` (was lazy-loaded above the fold); logo `alt` now descriptive; H1 gains an
  `sr-only` "Monte Deluxe — " prefix (design unchanged, brand carried in the single H1).
- `components/sections/About.tsx` — one natural location sentence added ("a premium fashion house
  born in Port Harcourt, Nigeria").
- `components/layout/Footer.tsx` — `<address>` line "Port Harcourt · Rivers State · Nigeria".

**Remaining placeholders (owner input needed)** — all in `lib/seo.ts` / `app/layout.tsx`:
street address, phone, exact geo coordinates (currently PH city-centre 4.8156, 7.0498), founder
name, founding date (guessed "2024" from the two-year anniversary), opening hours, and
Google/Bing/Yandex site-verification codes.

**Verified (2026-07-07).** `npm run lint` + `npm run build` clean; all 8 routes static.
Production-server HTML confirmed: canonical, full OG/Twitter/robots meta, valid JSON-LD `@graph`
with 7 nodes and 6 FAQ entries matching the 6 visible `<details>`, single H1 containing
"Monte Deluxe", footer address present, hero images eager with 2 image-preload links,
robots.txt/sitemap.xml/opengraph-image all serve correctly against montedeluxe.com URLs.

---

## 2026-07-07 — Social icons, Instagram carousel, scroll reveals & polish pass

**Context.** Refinement pass on the finished page: replace text social links with icons, turn the
static "From Instagram" strip into a carousel, make every section animate in on scroll, and tighten
spacing/typography consistency — without changing content, brand, colors, or design direction.

**Changed.**

- **Installed `react-icons`** (new dependency). The request asked for Lucide social icons, but the
  installed `lucide-react@1.23.0` ships **no brand icons** (verified against its full type
  declarations — `Instagram`/`TikTok`/`Facebook` etc. do not exist in 1.x). Owner approved
  react-icons instead; brand glyphs come from one family, `react-icons/fa6`
  (`FaInstagram`, `FaTiktok`, `FaEnvelope`). Chevrons/Lock/MapPin still come from lucide-react.
- **Social icons** (`Navbar.tsx`, `Footer.tsx`): text links ("IG"/"TT"/"EMAIL", "Instagram"/
  "TikTok"/"Email") replaced with icon links carrying `aria-label`s (icons are `aria-hidden`);
  gold hover tint; `target="_blank"` dropped for the `mailto:` link. The Instagram section's
  Follow button gained an `FaInstagram` glyph next to its text. Also fixed the footer typo
  `© MONTE 2026` → `© MONTÉ 2026` via the `BRAND` constant.
- **Instagram carousel** (`sections/Instagram.tsx`, now a client component): native scroll-snap
  track (larger tiles: ~70vw mobile, 3-up desktop) + lucide chevron arrows (desktop, disabled at
  ends) + gold dot navigation. Active index derives from `scrollLeft` (rAF-throttled), so swipes,
  arrows, and dots never desync. Autoplay every 5s with wrap-around; pauses on hover/focus/hidden
  tab, stops permanently after any manual interaction, and never runs under reduced motion.
  A11y: `role="region"` + `aria-roledescription="carousel"`, labeled slides/dots/arrows.
- **`Reveal` primitive** (`components/ui/Reveal.tsx`): reusable fade+rise-on-scroll wrapper with a
  `delay` prop for cascades and a `standalone` mode for use outside `AnimatedSection`; renders a
  plain div under reduced motion. Applied throughout so inner elements stagger in on scroll:
  About (eyebrow/heading/copy), Events (header + each card), Collection (heading, each tile, lock
  line), Instagram (heading/carousel/CTA), Footer (standalone).
- **Structural cleanup**: `section`/`rhythm` classname exports moved out of `app/page.tsx` into
  `lib/constants.ts` as `SECTION_X`/`SECTION_RHYTHM` (+ new shared `CONTAINER`); Hero's dead
  imports and commented-out JSX removed.
- **Visual polish** (colors untouched): Collection/Instagram headings scaled up to the About/Events
  hierarchy (`text-3xl md:text-4xl` — they were smaller than card titles); container width unified
  on `max-w-[1100px]` via `CONTAINER`; Events cards given symmetric `min-h-[430px]` + `rounded-card`
  and the non-actionable "RSVP Opens Soon" `<button>` demoted to an `aria-disabled` `<p>`;
  EmailSignup's accidental `shadow shadow-gold-bright` replaced with a soft gold glow;
  Collection's hand-rolled lock SVG replaced with lucide `Lock`; heading→content gaps normalized
  to `mt-10 sm:mt-12`; navbar logo properly centered (removed `mt-4` hack); arbitrary
  `tracking-[0.35em]` values swapped for the `tracking-mega` token.

**Verified (2026-07-07).** `npm run lint` + `npm run build` clean. Dev-server HTML confirmed:
icon links with correct `aria-label`s in navbar/footer, "© MONTÉ 2026", carousel region with 6
labeled slides, 6 dots, both arrows, lucide lock, mailto link without `target="_blank"`, and
sections server-render at `opacity:0` (nothing appears pre-loaded before its scroll reveal).

---

## 2026-07-07 — Project kickoff & foundation

**Context.** Building the MONTÉ website per `first-prompt.md`: a single-page, dark-luxury landing
page for a Lagos fashion brand launching Collection 001 on July 22, 2026. Stack: Next.js 15.5.20
(App Router), TypeScript, Tailwind CSS v4, Framer Motion. Starting point was the default
`create-next-app` boilerplate.

**Deviations from the spec (approved by the project owner):**

- **Missing docs bundle.** `AGENTS.md` instructs reading `node_modules/next/dist/docs/` before
  writing code, but that directory does not exist in this install — it is stock `next@15.5.20`
  with no bundled docs (verified by searching the whole tree). Proceeding with standard, stable
  Next 15 App Router conventions instead.
- **No `src/` directory.** The spec's file tree uses `src/`, but this project keeps `app/` at the
  root with the `@/*` → `./` path alias (`tsconfig.json`). New folders (`components/`, `lib/`,
  `public/images/`) live at the project root and are imported as `@/components/...`, `@/lib/...`.
- **Placeholder images are real files** generated into `public/images/` and referenced via
  `next/image`, rather than the CSS-only approach.

**Changed.**

- Installed `framer-motion@12` (only new dependency; fonts come from `next/font/google`).
- **Design system** (`app/globals.css`): replaced boilerplate with Tailwind v4 `@theme`
  defining all §3 tokens — surfaces, gold accents, text, borders, fonts, letter-spacing, type
  scale, radius — plus the `gold-line` keyframe, dark `body`, gold `:focus-visible`, and a global
  `prefers-reduced-motion` guard.
- **Fonts** (`lib/fonts.ts`): Playfair Display (display), Inter (body), JetBrains Mono (countdown),
  wired to `--font-*` vars and applied on `<html>` in `app/layout.tsx`. Metadata set per §6.
- **Constants** (`lib/constants.ts`): brand `MONTÉ`, `TARGET_DATE` = 2026-07-22 00:00 WAT (UTC+1),
  social links, signup storage key. **Motion** (`lib/motion.ts`): luxury easings/durations and
  shared reveal variants.
- **Placeholder images** (`public/images/*.svg`): dark, moody radial-gradient placeholders with
  faint gold glow + grain, generated deterministically (hero, about, 3× collection, 6× instagram).
  Rendered as CSS backgrounds to avoid Next's SVG-optimization config.
- **UI components**: `MonteLogo` (crest SVG), `Button` (outline/filled, gold hover-invert),
  `CountdownTimer` (live, WAT, `useSyncExternalStore` for hydration-safe 1s tick),
  `AnimatedSection` (scroll-reveal, reduced-motion aware), `GoldDivider` (scaleX draw-in).
- **Sections**: `Navbar` (fixed, blur-on-scroll), `Hero` (full-viewport, orchestrated load),
  `EmailSignup` (validation + localStorage + success state), `About`, `Events` (anniversary +
  Roomly), `Collection` (hover-brighten grid + lock), `Instagram` (scroll row + CTA), `Footer`.
- **Page** (`app/page.tsx`): composed all sections with reveals and gold dividers.

**Verified (2026-07-07).** `npm run build` compiles clean — no TS/ESLint errors or warnings.
Dev server renders every section with correct copy (MONTÉ È wordmark, "A New Era Begins.",
countdown labels, all headings, CTAs). Fonts load (Playfair confirmed in CSS), body uses the true
`#050505` dark token, and the countdown server-renders `00:00:00:00` (no hydration mismatch) before
ticking live on the client.

**Known note.** Next warns about multiple lockfiles (a `package-lock.json` also exists one level up
at `/Users/mac/Documents/2026_PJs/`). Pre-existing and harmless; can be silenced later via
`outputFileTracingRoot` in `next.config.ts` if desired.
