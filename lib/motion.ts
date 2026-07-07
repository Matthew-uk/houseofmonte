import type { Variants } from "framer-motion";

// Luxury motion language (first-prompt.md §4): slow, confident, never bouncy.
export const EASE_LUXURY = [0.25, 0.1, 0.25, 1.0] as const; // smooth cubic-bezier
export const EASE_REVEAL = [0.0, 0.0, 0.2, 1.0] as const; // deceleration

export const DURATION_FAST = 0.4;
export const DURATION_MEDIUM = 0.7;
export const DURATION_SLOW = 1.2;

// Section scroll-reveal: fade + rise 30px, staggering children.
export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION_MEDIUM,
      ease: EASE_REVEAL,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

// Child item within a revealing section.
export const itemReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_MEDIUM, ease: EASE_REVEAL },
  },
};

// Shared viewport config — trigger early, once only.
export const VIEWPORT_ONCE = { once: true, amount: 0.15 } as const;
