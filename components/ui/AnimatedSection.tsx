"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { sectionReveal, VIEWPORT_ONCE } from "@/lib/motion";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

// Scroll-reveal wrapper: fades + rises into view once, staggering its
// children. Renders static (no animation) when reduced motion is preferred.
export function AnimatedSection({
  children,
  className,
  id,
}: AnimatedSectionProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
    >
      {children}
    </motion.section>
  );
}
