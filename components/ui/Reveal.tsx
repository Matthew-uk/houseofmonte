"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DURATION_MEDIUM, EASE_REVEAL, VIEWPORT_ONCE } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to hold back this item — use i * 0.1 for cascades. */
  delay?: number;
  /**
   * By default Reveal inherits the hidden→visible switch from a parent
   * AnimatedSection. Set standalone when there is no such parent (e.g. Footer)
   * so it drives its own whileInView trigger.
   */
  standalone?: boolean;
}

// Inner scroll-reveal: fades + rises a block within a section. Pairs with
// AnimatedSection (which reveals the section shell) to give staggered,
// per-element entrances. Renders static under reduced motion.
export function Reveal({
  children,
  className,
  delay = 0,
  standalone = false,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION_MEDIUM, ease: EASE_REVEAL, delay },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      {...(standalone
        ? { initial: "hidden", whileInView: "visible", viewport: VIEWPORT_ONCE }
        : {})}
    >
      {children}
    </motion.div>
  );
}
