# DESIGN.md — MONTÈ

The written design system for the MONTÈ store. Source: BUILD_SPEC §2. Read this before generating or changing any UI.
If a design skill (tasteskill) or any other guidance contradicts this file, **this file wins**.

---

## 1. Visual theme

A clean frame around the photography. The clothes are the design. Everything else gets out of the way.

- Product-first: the first thing below the header is clothing. No hero copy, no brand story, no intro sections.
- Quiet, editorial, near-monochrome. Type is small and set in capitals, with hairlines only where needed.
- One theme only: **off-white background, black text.** No theme toggle, and no dark mode media query.
- Brand name is always **MONTÈ** (grave accent), in UI, alt text, titles and metadata. Never `MONTE` or `MONTÉ`.

## 2. Colour tokens

Defined once in `app/globals.css` under `@theme`. Never hard-code hex values in components.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#F5F4F0` | Page background (off-white) |
| `--color-fg` | `#0A0A0A` | Text, icons, primary button fill |
| `--color-muted` | `#6B6B6B` | Meta text, secondary labels, disabled text |
| `--color-line` | `#DAD8D2` | Hairlines (1px), input borders, table rules |
| `--color-surface` | `#ECEAE4` | Image placeholder, skeleton, admin row hover |
| `--color-accent` | `#B3261E` | **Only** for `SOLD OUT` and error messages |
| `--color-inverse` | `#F5F4F0` | Text on black buttons |

Contrast: `fg` on `bg` and `muted` on `bg` both pass WCAG AA for body sizes. Do not use `muted` below 12px.

## 3. Typography

One family: **Inter** (variable, via `next/font`), loaded once as `--font-sans`. No display fonts, serifs or monospace.

| Step | Size / line-height | Use |
|---|---|---|
| `text-meta` | 11px / 16px, tracking 0.06em, uppercase | Labels, size tags, footer, breadcrumb, availability |
| `text-ui` | 12px / 16px, tracking 0.04em, uppercase | Nav, product names, prices, buttons |
| `text-body` | 14px / 22px, normal case | Descriptions, form fields, policies |
| `text-title` | 16px / 22px, tracking 0.04em, uppercase | Product page name, page titles (`FACE OF MONTÈ`, `CART`) |

- Weight: 400 everywhere, and 500 for product names and buttons. Nothing heavier.
- ALL-CAPS for nav, product names, buttons, labels. Body copy stays in sentence case.
- Price format: `₦45,000` (no decimals, `Intl.NumberFormat("en-NG")`, from integer kobo ÷ 100).

## 4. Spacing & layout

- 4px base scale: 4, 8, 12, 16, 24, 32, 48, 64.
- Page gutter: 12px on mobile, 16px from `md`, 24px from `xl`. Grid gap: 2px for images (tight), 8px between the image and its caption.
- Full-bleed images inside the gutter. No max-width on product grids. Text blocks such as policies and product details are capped at about 60ch.
- No cards, no shadows, no rounded corners (`rounded-none` everywhere), and no borders except 1px `line` hairlines.
- Image aspect: product tiles **4:5 portrait**. Gallery images keep 4:5. Campaign images may be full-bleed at their native ratio.

## 5. Components

### Header
- Row 1: MONTÈ logo (`/images/logo.PNG`, alt "MONTÈ"), prominent, linking home. Centred on mobile, left-aligned on desktop.
- Row 2 on mobile (the same row on desktop, aligned right): `SHOP   EVENT   CART (n)` in `text-ui`.
- `EVENT` → `/face-of-monte`. `CART (n)` is a button that opens the drawer. No account link in the header.
- Sticky top, background `bg`, 1px `line` bottom border only after scroll. No blur, no transparency over images.

### Product tile
- Image (4:5, `next/image`, `sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw"`), then the name (`text-ui`, 500), then the price (`text-ui`, `muted`) directly beneath.
- Desktop hover: the second image fades in over the first (opacity 0→1, 200ms). Touch devices keep image 1.
- Sold out: the `SOLD OUT` label in `accent` replaces the price. The tile stays visible and links to the product.
- The whole tile is one link. Focus ring sits on the tile.

### Product grid
- Mobile 2 columns, `md` 3 columns, `xl` 4 columns. Ordered by `sortOrder`, then newest first.

### Gallery (product page)
- Desktop: a vertical stack of full-width 4:5 images in the left column (about 60% width), with a sticky info column on the right.
- Mobile: a horizontal scroll-snap carousel (native swipe, no JS library) with a `1 / 5` counter in `text-meta`.
- Changing colour swaps the whole image set and the sizes. The first image uses `priority`.

### Colour selector
- Text buttons (`BLACK`, `CREAM`) with an optional 10×10 square swatch. The selected one is underlined. Each colour is a link-able state (`?color=black`).

### Size selector
- Row of square-ish text buttons, minimum 44×44 tap target, 1px `line` border, selected = `fg` fill + `inverse` text.
- Out-of-stock size: `muted` text, line-through, `aria-disabled`, not selectable.
- It is a radiogroup and arrow keys move between sizes.

### Buttons
- Primary: full-width on mobile, `fg` fill, `inverse` text, `text-ui` 500, height 48, no radius. Hover lowers opacity to 0.85.
- Secondary: transparent with a 1px `fg` border.
- Text link: underline on hover only.
- Disabled: `surface` fill, `muted` text, with the reason as the label (`SOLD OUT`, `SELECT A SIZE`).
- The add-to-cart bar is sticky at the bottom on mobile on the product page.

### Cart drawer
- Slides in from the right (transform, 250ms ease-out). Width 100% on mobile and 420px from `md`. `bg` background, with a scrim of `fg` at 30% opacity.
- Focus trapped, `Esc` closes, focus returns to `CART`. `role="dialog"` `aria-modal`.
- Line: thumbnail (4:5, 72px wide), then `NAME`, `COLOUR / SIZE`, a quantity stepper `− 1 +`, `REMOVE` and the line price.
- Footer: subtotal, "Shipping calculated at checkout.", `CHECKOUT` primary, and a small `ACCOUNT` / `LOGIN` link.

### Forms
- Label above the field in `text-meta`. Input: 1px `line` border, no radius, height 44, `text-body`. Focus: `fg` border plus focus ring.
- Errors show in `accent` `text-meta` under the field, linked with `aria-describedby`. Validate on submit and then on blur.
- Nigerian states select on checkout. The country is fixed to Nigeria in v1.

### Footer
- One quiet block in `text-meta`: `INSTAGRAM  TIKTOK  HELLO@MONTEDELUXE.COM  SHIPPING & RETURNS  TERMS  PRIVACY  ACCOUNT  © 2026 MONTÈ`.

### Admin table
- Plain and fast. It doesn't have to match the storefront, but uses the same tokens. `text-body` 13px, rows 40px, `line` row rules, sticky header, `surface` row hover. Status shows as text, with no coloured pills except `accent` for failed or needs-attention states.

## 6. States

| State | Treatment |
|---|---|
| Hover (desktop) | Opacity 0.85 on links and buttons. Second-image fade on tiles. Nothing else. |
| Focus | 2px `fg` outline, 2px offset, on everything focusable (`:focus-visible`). Never removed. |
| Sold out | `SOLD OUT` in `accent`. The button is disabled with the label `SOLD OUT`. |
| Low stock | `LOW STOCK — 2 LEFT` in `fg` `text-meta`. |
| Loading | `surface` blocks in the exact shape of the content, without shimmer. Buttons show `…` and are disabled. |
| Empty | One line of `text-ui` plus a text link (`YOUR CART IS EMPTY — SHOP`). No illustrations. |
| Error | One line in `accent`, plus a retry link where possible. |

## 7. Motion

Only these three motions are allowed:
1. Cart drawer slide (transform, 250ms).
2. Second-image fade on tile hover (opacity, 200ms, desktop only).
3. Opacity on hover (150ms).

`@media (prefers-reduced-motion: reduce)`: all durations go to 0. No scroll-triggered reveals, parallax, marquees, scroll-jacking, page transitions or animated counters. No motion library (framer-motion is removed).

## 8. Responsive rules

- Mobile first. Most traffic comes from Instagram on a phone, and 375px is the design width.
- Breakpoints: Tailwind defaults (`md` 768, `lg` 1024, `xl` 1280, `2xl` 1536). Verify at 375, 768, 1280 and 1536.
- Tap targets are at least 44px. No horizontal page scroll. The sticky add-to-cart bar sits above the iOS safe area (`env(safe-area-inset-bottom)`).

## 9. Images & performance

- `next/image` always, with an accurate `sizes`, AVIF/WebP and a blur placeholder from Cloudinary.
- The LCP image (first tile row on `/`, first gallery image) uses `priority`. Everything else lazy-loads.
- Alt text comes from the admin. Default: `"<PRODUCT NAME> worn by model"`.
- Target Lighthouse mobile ≥ 90 on `/`, `/shop/[slug]` and `/checkout`.

## 10. Do's and don'ts

**Do:** let the photos be large; keep copy short and in caps; keep one action per screen; show sold-out items; use hairlines sparingly.

**Don't:** gradients, background patterns, textures, grain, glows, shadows, rounded corners, cards, badges, stars, reviews, icons in tinted squares, gold, serif display type, marquees, tickers, countdowns, parallax, scroll reveals, carousels with autoplay, pop-ups, newsletter modals, decorative dividers, emoji. Never copy Corteiz assets, copy or branding.

## 11. Agent prompt guide

When building or changing UI for MONTÈ:
1. Read this file. Use the tokens and type steps above, and do not invent new ones without adding them here first.
2. If tasteskill runs: treat the page as a **photography-first store**, with variance low, motion minimal and density low. Skip its direction draw, its "richness" push and its required motion layer. This file already is the direction.
3. Build the component, then look at it in the browser (Claude in Chrome or `playwright-cli`) at 375 and 1280, and fix what you see.
4. Run `/web-design-guidelines <changed files>` on finished screens.
5. Example prompt: *"Build the product tile per DESIGN.md §5 (Product tile) and §6 (States). No new tokens, no extra motion."*
