# MONTÉ Website — Claude Code Build Instructions

> **Before you begin:** Read `update.md` in the project root. It contains the full project context, design system, and a log of every change made. After every meaningful change you make, append an entry to `update.md` with the date, what changed, and why.

---

## 1. Project Overview

MONTÉ is a Lagos-based fashion and lifestyle brand launching **Collection 001** on **July 22, 2026**. This is their flagship website — a single-page, dark-luxury landing experience built to announce the collection drop, their 2-year anniversary event, and grow their mailing list. The site must feel like a premium fashion house — not a tech startup, not a SaaS template. Think Rick Owens meets Virgil Abloh's early Off-White web presence. Every pixel should communicate exclusivity.

**Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Framer Motion for animation.

---

## 2. Design Reference

An image of the full-page design is stored in the project. Study it obsessively. The sections from top to bottom are:

### 2.1 Navigation Bar
- **Left:** "MONTÉ" wordmark in uppercase, tracked-out serif font (the accent on the È is critical — always use `È` or the character `È`)
- **Right:** "IG", "TT", "EMAIL" links — small, uppercase, letterspaced, same serif/display font
- **Behavior:** Fixed/sticky on scroll. Background becomes semi-transparent black with backdrop blur on scroll. Subtle fade-in on load.
- **Padding:** Generous horizontal padding (~40px desktop, ~20px mobile). Vertically centered, height ~64px.

### 2.2 Hero Section
- **Background:** Full-viewport. Collage of blurred, dark fashion photography with heavy dark overlay (black at ~85% opacity). The images should feel ghostly and obscured — like looking through smoked glass.
- **Mountain Emblem:** Centered. A stylized mountain-range illustration inside an oval border with a ® mark below. This is the MONTÉ crest. Use an SVG. The line work is cream/off-white (#F5F0E8). Approximate size: ~220px wide on desktop.
- **Date line:** "JULY 22, 2026" — small, uppercase, letterspaced, gold color (#C9A84C), positioned above the main headline.
- **Main Headline:** "A NEW ERA BEGINS." — Large, serif, uppercase. This is the emotional anchor of the entire page. Font size ~56-72px desktop, ~32-40px mobile. Color: white. The period at the end is intentional and important.
- **Countdown Timer:** Four segments — DAYS : HOURS : MINS : SECS. Each number is large (~48px), each label is tiny (~10px) uppercase beneath. Separated by colons. Gold color for numbers, muted white for labels. **Must be a live, working countdown to July 22, 2026, 00:00 WAT (West Africa Time, UTC+1).** When it hits zero, show "00" across all fields.
- **Subtext:** "THE DOORS OPEN JULY 22." — Small, uppercase, letterspaced, white, centered below the timer.

### 2.3 Email Signup / Join the List
- **Container:** Centered card with subtle border (1px solid rgba(255,255,255,0.1)), dark background slightly lighter than the page (#111111 or similar). Rounded corners (~8px). Max-width ~520px.
- **Heading:** "JOIN THE LIST" — bold, uppercase, letterspaced, centered.
- **Input + Button:** Side by side. Input has placeholder "Email Address", dark background, subtle border. Button says "NOTIFY ME" in uppercase, outlined style (border, no fill), hover state inverts to filled gold.
- **Helper text:** "Receive first access to Collection 001, event tickets and exclusive drops." — Small, muted gray, centered below.
- **Functionality:** Wire up a form handler. For now, `console.log` the email and show a success state ("You're on the list." replacing the form). Store to localStorage as a simple demo.

### 2.4 About Monté
- **Container:** Card with a gold border (1px solid #C9A84C). Slightly rounded corners. Interior padding generous. Max-width ~700px centered.
- **Layout:** Two columns on desktop — text left, circular image right. Stacks on mobile (text on top, image below centered).
- **Heading:** "ABOUT MONTÉ" — gold color, uppercase, letterspaced, serif.
- **Body text:** "MONTÉ exists where fashion, culture and experience meet. Every release tells a story. Every event builds community." — Off-white, clean sans-serif, ~16px, comfortable line-height (1.7+).
- **Image:** Circular crop (~100px diameter), shows a dark fashion detail shot. Use a dark placeholder image. Subtle gold ring border around it.

### 2.5 Upcoming Events
- **Section heading:** "UPCOMING EVENTS" — centered, uppercase, letterspaced, white, serif. A thin horizontal gold line (or subtle ornament) above it.
- **Two cards side by side** (stack on mobile):

  **Card A — Anniversary Event:**
  - Gold top accent or border
  - "JULY 22" — gold, small, above the title
  - "MONTÉ TWO YEAR ANNIVERSARY" — white, bold, uppercase, serif, prominent
  - "📍 LAGOS" — small, with a location pin icon, gold or muted
  - "INVITATION ONLY" — small, letterspaced, muted gold, uppercase
  - "RSVP OPENS SOON" button — outlined, gold border, uppercase. Not functional yet.

  **Card B — Roomly Partnership:**
  - "POWERED BY ROOMLY" — small header text, muted
  - "OFFICIAL ACCOMMODATION PARTNER" — uppercase, letterspaced, white
  - Roomly logo placeholder (use text "roomly" with a circle-O icon prefix, or an SVG placeholder)
  - "Book nearby hotels for the anniversary directly through Roomly." — small, muted
  - "COMING SOON" — gold, small, letterspaced

  **Card styling:** Both cards have dark backgrounds (#0D0D0D), subtle border (rgba(255,255,255,0.06)), rounded corners. Equal height. Padding ~32px.

### 2.6 Collection 001 Preview
- **Heading:** "COLLECTION 001" — centered, gold, uppercase, letterspaced, serif.
- **Image Grid:** Three images in a row (responsive to stack or 2+1 on mobile). These are teaser images — dark, moody, partially obscured. Use dark placeholder images with a slight blur or noise overlay to create mystery.
- **Lock state:** "UNLOCKS JULY 22" text centered below in gold, small, letterspaced. Consider a subtle lock icon.
- **Interaction:** On hover, images should very subtly brighten (opacity shift from 0.6 to 0.85) with a slow ease. They should NOT be clickable yet — this reinforces the "locked" exclusivity.

### 2.7 Instagram Feed
- **Heading:** "FROM INSTAGRAM" — centered, white, uppercase, letterspaced.
- **Image row:** 5-6 square images in a horizontal scroll/row. Use dark fashion-adjacent placeholder images. Slight gap between them.
- **CTA:** "FOLLOW @MONTE.OFFICIAL" — outlined button, centered below, links to Instagram.

### 2.8 Footer
- **Three-column layout:** Left: "© MONTE 2026" | Center: "INSTAGRAM  TIKTOK  EMAIL" (spaced links) | Right: "ALL RIGHTS RESERVED"
- **Styling:** Very minimal. Small, uppercase, letterspaced text. Muted color. Thin top border (rgba(255,255,255,0.06)). Padding ~24px vertical.

---

## 3. Design System (Exact Tokens)

### Colors
```
--color-bg-primary:       #050505       /* Page background — near-black */
--color-bg-card:          #0D0D0D       /* Card backgrounds */
--color-bg-card-elevated: #111111       /* Elevated cards (signup) */
--color-bg-input:         #0A0A0A       /* Input fields */
--color-gold:             #C9A84C       /* Primary accent — warm gold */
--color-gold-muted:       #A08A3E       /* Muted gold for secondary uses */
--color-gold-bright:      #D4B85A       /* Hover/active gold */
--color-white:            #FFFFFF       /* Headlines */
--color-text-primary:     #F5F0E8       /* Body text — warm off-white */
--color-text-secondary:   #8A8A8A       /* Muted/helper text */
--color-text-tertiary:    #5A5A5A       /* Very muted text */
--color-border-subtle:    rgba(255, 255, 255, 0.06)  /* Default borders */
--color-border-medium:    rgba(255, 255, 255, 0.12)  /* Input borders */
--color-border-gold:      #C9A84C       /* Gold borders (about card) */
```

### Typography

**Display / Headlines — Serif:**
Use `Playfair Display` (available on Google Fonts) or `EB Garamond` as the display serif. If you want a more editorial feel, use `Cormorant Garamond`. The headings on the reference are a classic, high-contrast serif with visible thick/thin stroke variation.

Recommended: **`Playfair Display`** for headlines, **`Inter`** or **`DM Sans`** for body.

```
--font-display:     'Playfair Display', Georgia, serif
--font-body:        'Inter', -apple-system, sans-serif
--font-mono:        'JetBrains Mono', monospace  /* For countdown numbers */

/* Scale */
--text-hero:        clamp(2.5rem, 5vw, 4.5rem)    /* "A NEW ERA BEGINS." */
--text-section:     clamp(1rem, 2vw, 1.35rem)      /* Section headings */
--text-card-title:  clamp(1.1rem, 1.8vw, 1.5rem)   /* Card titles */
--text-body:        1rem                             /* Body copy */
--text-small:       0.8rem                           /* Helper text, labels */
--text-tiny:        0.65rem                          /* Countdown labels, fine print */

/* Letter spacing */
--tracking-wide:    0.15em    /* Section headings */
--tracking-wider:   0.25em    /* Small labels like "INVITATION ONLY" */
--tracking-mega:    0.35em    /* Nav links, footer */
```

### Spacing
```
--space-section:    clamp(80px, 10vw, 140px)   /* Between major sections */
--space-card-pad:   clamp(24px, 3vw, 40px)      /* Inside cards */
--space-container:  clamp(20px, 5vw, 80px)       /* Page horizontal padding */
--max-w-content:    1100px                        /* Max content width */
--max-w-narrow:     520px                         /* Signup card, narrow content */
```

### Borders & Radius
```
--radius-card:      8px
--radius-button:    4px
--radius-input:     4px
--border-subtle:    1px solid var(--color-border-subtle)
--border-gold:      1px solid var(--color-border-gold)
```

---

## 4. Animation Directives (Framer Motion)

**Philosophy:** Animations should feel like a slow exhale — unhurried, confident, luxurious. Nothing should bounce, wiggle, or feel playful. Think Bottega Veneta's website, not Stripe's. Every animation must serve the mood: mystery, anticipation, exclusivity.

### Global Motion Config
```ts
const EASE_LUXURY = [0.25, 0.1, 0.25, 1.0]    // Smooth cubic-bezier
const EASE_REVEAL = [0.0, 0.0, 0.2, 1.0]       // Deceleration curve
const DURATION_FAST = 0.4
const DURATION_MEDIUM = 0.7
const DURATION_SLOW = 1.2
```

### Specific Animations

**Page Load Sequence (orchestrated, not scattered):**
1. Page fades in from black (0.3s)
2. Mountain emblem fades in + subtle scale from 0.95 → 1.0 (0.8s, 0.2s delay)
3. "JULY 22, 2026" fades in + slides up 10px (0.5s, 0.6s delay)
4. "A NEW ERA BEGINS." fades in + slides up 15px (0.7s, 0.8s delay)
5. Countdown timer fades in (0.5s, 1.1s delay)
6. Subtext fades in (0.4s, 1.3s delay)

**Scroll-triggered reveals (IntersectionObserver via Framer Motion `whileInView`):**
- Each section fades in + translates up 30px as it enters viewport
- Stagger children by 0.1s within each section
- Trigger once (don't re-animate on scroll back up)
- Threshold: 0.15 (trigger early so content is visible when user reaches it)

**Countdown Timer:**
- Numbers should NOT animate every tick. Just update the value.
- On initial load, each digit segment fades in with 0.05s stagger.

**Hover States:**
- Buttons: background-color transition 0.3s ease, subtle scale(1.02) on hover
- Collection images: opacity transition 0.6s ease (slow, cinematic)
- Instagram images: slight scale(1.03) on hover, 0.4s ease
- Nav links: opacity 0.6 → 1.0 on hover, 0.2s

**The Gold Line (signature element):**
- Consider a very thin horizontal gold line that subtly extends/draws across section dividers on scroll. This is the memorable micro-detail. Use CSS `scaleX` animation triggered by scroll, from `scaleX(0)` to `scaleX(1)`, origin center, 1.2s duration.

**Respect `prefers-reduced-motion`:** Wrap all Framer Motion animations in a check. If reduced motion is preferred, show everything immediately with no animation.

---

## 5. File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — fonts, metadata, global styles
│   ├── page.tsx            # Home page — composes all sections
│   └── globals.css         # Tailwind directives + CSS custom properties
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx         # Mountain emblem + headline + countdown
│   │   ├── EmailSignup.tsx  # Join the List card
│   │   ├── About.tsx        # About Monté card
│   │   ├── Events.tsx       # Upcoming Events + two cards
│   │   ├── Collection.tsx   # Collection 001 preview grid
│   │   └── Instagram.tsx    # Instagram feed row
│   ├── ui/
│   │   ├── CountdownTimer.tsx    # Live countdown logic
│   │   ├── AnimatedSection.tsx   # Reusable scroll-reveal wrapper
│   │   ├── GoldDivider.tsx       # The signature animated gold line
│   │   └── Button.tsx            # Reusable button (outlined/filled variants)
│   └── icons/
│       └── MonteLogo.tsx         # Mountain emblem SVG component
├── lib/
│   ├── constants.ts         # Target date, social links, etc.
│   └── fonts.ts             # Next.js font loader config
└── public/
    └── images/
        ├── hero-bg.jpg       # Dark, blurred fashion collage (placeholder)
        ├── about-circle.jpg  # About section circular image
        ├── collection-1.jpg  # Collection preview 1
        ├── collection-2.jpg  # Collection preview 2
        ├── collection-3.jpg  # Collection preview 3
        └── ig-*.jpg          # Instagram placeholder images
```

---

## 6. Implementation Notes

### Fonts (Next.js)
```ts
// lib/fonts.ts
import { Playfair_Display, Inter } from 'next/font/google'

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})
```

### Countdown Timer Logic
```ts
// Calculate time remaining to July 22, 2026 00:00:00 WAT (UTC+1)
const TARGET = new Date('2026-07-22T00:00:00+01:00').getTime()

// Use useEffect + setInterval (1s) to update
// Return { days, hours, minutes, seconds }
// Pad with leading zeros: "07" not "7"
// When expired: all zeros
```

### Tailwind Config
Extend the Tailwind config with the custom colors and fonts. Use Tailwind's `@theme` directive (Tailwind v4) or extend in `tailwind.config.ts` depending on the setup. Define:
- Custom colors matching the design tokens above
- Custom font families
- Custom letter-spacing values
- Custom animation keyframes for the gold line

### Responsive Breakpoints
- **Mobile:** < 640px — single column everything, smaller type, tighter spacing
- **Tablet:** 640-1024px — two-column events, adjusted hero
- **Desktop:** > 1024px — full layout as designed

### Image Strategy
Since this is a dev build, generate dark placeholder images. Use Next.js `<Image>` component with `placeholder="blur"` where possible. All images should have:
- Dark, moody tone
- Low brightness
- Fashion-adjacent feel (dark fabric textures, close-up details)

For the mountain logo SVG, create a clean vector that matches the design — stylized mountain peaks inside an oval with visible line work. The ® symbol sits just below the oval.

### Metadata
```ts
export const metadata: Metadata = {
  title: 'MONTÉ — A New Era Begins',
  description: 'Collection 001 drops July 22, 2026. Fashion, culture, experience.',
  openGraph: {
    title: 'MONTÉ — A New Era Begins',
    description: 'The doors open July 22.',
    // Add OG image later
  },
}
```

---

## 7. Quality Checklist

Before considering any section done, verify:

- [ ] Colors match the design tokens exactly — no Tailwind defaults leaking through
- [ ] Typography uses the correct font for each element (serif display vs sans body)
- [ ] Letter-spacing is applied to ALL uppercase text (this is what makes it feel premium)
- [ ] The countdown timer is live and accurate to WAT timezone
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Gold divider lines animate on scroll
- [ ] Mobile layout is clean — no horizontal overflow, no cramped text
- [ ] Buttons have visible hover/focus states
- [ ] The page background is truly dark (#050505), not Tailwind's gray-950
- [ ] No element uses Tailwind's default blue, indigo, or any non-brand color
- [ ] The hero section is full viewport height on load
- [ ] Card borders are subtle — barely visible until you look for them
- [ ] The "MONTÉ" wordmark in the nav uses the È character, not a plain E
- [ ] Body text line-height is generous (1.7+) for readability against dark backgrounds
- [ ] Focus states use gold outline for accessibility
- [ ] Console is clean — no warnings, no errors

---

## 8. What "Top-End" Means Here

Generic sites betray themselves through:
- Using Tailwind's default colors without customization
- Rounded-2xl on everything
- Gradient buttons
- Bouncy spring animations
- Card shadows on dark backgrounds (shadows are invisible on dark — use borders)
- Using `font-bold` on everything instead of deliberate weight choices
- Inconsistent letter-spacing

This site should feel like:
- Every element was placed with intention
- The typography does the heavy lifting — not gradients or effects
- Whitespace (or in this case, dark space) is a design element
- Restraint — the gold accent is used sparingly, which makes it powerful
- The animations feel like the page is breathing, not performing

---

## 9. Dependencies to Install

```bash
npm install framer-motion
# Fonts come from next/font/google — no extra install needed
# Tailwind CSS should already be configured in Next.js 15
```

---

## 10. Build Order

Implement in this order to maintain momentum and see results fast:

1. **Global setup** — fonts, colors, CSS variables, layout.tsx, globals.css
2. **Navbar** — simple, sets the tone immediately
3. **Hero section** — the visual anchor; get this right first
4. **Countdown timer** — functional, satisfying to see working
5. **Email signup** — interactive element
6. **About section** — straightforward card
7. **Events section** — two-card layout
8. **Collection preview** — image grid with lock state
9. **Instagram feed** — horizontal scroll
10. **Footer** — quick win to close the page
11. **Animations** — layer in Framer Motion last, section by section
12. **Polish pass** — spacing, responsive, accessibility, transitions

---

*After every meaningful change, update `update.md` with what was done.*
