"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { EASE_REVEAL } from "@/lib/motion";
import { SECTION_X } from "@/lib/constants";
import Image from "next/image";
import { AnimatedSection } from "../ui/AnimatedSection";
import { EmailSignup } from "./EmailSignup";

// Orchestrated page-load sequence (first-prompt.md §4): emblem → date →
// headline → countdown → subtext, each easing in with an increasing delay.
export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number, y = 12) => ({
    initial: reduce ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: reduce ? 0 : delay, ease: EASE_REVEAL },
  });

  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center pt-28 md:pt-0"
    >
      {/* Ghostly, obscured fashion collage + heavy dark overlay.
          next/image with priority so the LCP background is preloaded. */}
      <Image
        src="/images/hero-bg.PNG"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/80" />

      {/* Emblem */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: reduce ? 0 : 0.2, ease: EASE_REVEAL }}
      >
        <Image
          src="/images/logo_2.png"
          alt="Monte Deluxe — luxury fashion brand in Port Harcourt, Nigeria"
          width={220}
          height={300}
          priority
          sizes="(min-width: 768px) 520px, 340px"
          className="mx-auto w-[340px] md:w-[520px]"
        />
      </motion.div>

      {/* Date line */}
      <motion.p
        {...rise(0.6, 10)}
        className="text-small uppercase tracking-wider text-gold font-bodoni"
      >
        July 22, 2026
      </motion.p>

      {/* Headline — the emotional anchor */}
      <motion.h1
        {...rise(0.8, 15)}
        className="mt-4 font-display text-hero font-medium uppercase leading-[1.05] tracking-wide text-white"
      >
        <span className="sr-only">Monte Deluxe — </span>A New Era Begins.
      </motion.h1>

      {/* Countdown */}
      <motion.div {...rise(1.1)} className="mt-10">
        <CountdownTimer />
      </motion.div>

      {/* Subtext */}
      <motion.p
        {...rise(1.3)}
        className="mt-8 text-small uppercase tracking-wider text-text-primary/90"
      >
        The doors open July 22.
      </motion.p>

      {/* Email Sign Up */}
      <AnimatedSection className={`${SECTION_X} pb-[clamp(80px,10vw,140px)] pt-32`}>
        <EmailSignup />
      </AnimatedSection>
    </section>
  );
}
