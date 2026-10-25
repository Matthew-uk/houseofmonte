# Design — short version (full: /DESIGN.md)

- Off-white `#F5F4F0` background, `#0A0A0A` text, and a single accent `#B3261E` used only for SOLD OUT and errors. Use tokens, never raw hex.
- Inter only. ALL-CAPS 11–12px with small tracking for nav, names, prices, buttons and labels. Body is 14px.
- No cards, shadows, radius, gradients, patterns or decoration. Only 1px hairlines.
- Product tile: 4:5 image, then NAME, then price. Second image fades in on desktop hover. Sold-out items stay visible.
- Grid: 2 columns on mobile, 3 at `md`, 4 at `xl`, with a 2px gap.
- Motion is limited to the drawer slide, the tile image fade and hover opacity, and is disabled under reduced motion.
- `next/image` always, with `sizes`, priority on the LCP image and a blur placeholder.
- Verify in a browser at 375 / 768 / 1280 / 1536 after each UI change.
