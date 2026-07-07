"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION_SLOW, EASE_LUXURY, VIEWPORT_ONCE } from "@/lib/motion";

interface GoldDividerProps {
  className?: string;
  width?: string; // tailwind width class, e.g. "w-16"
}

// The signature micro-detail: a thin gold line that draws itself across the
// section divider on scroll (scaleX 0 → 1, origin center).
export function GoldDivider({ className = "", width = "w-16" }: GoldDividerProps) {
  const reduce = useReducedMotion();
  return (
    <div className={`flex justify-center ${className}`}>
      <motion.span
        aria-hidden
        className={`block h-px ${width} bg-gold origin-center`}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: DURATION_SLOW, ease: EASE_LUXURY }}
      />
    </div>
  );
}
