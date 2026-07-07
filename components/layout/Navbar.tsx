"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa6";
import { BRAND, SOCIAL } from "@/lib/constants";
import { DURATION_MEDIUM, EASE_LUXURY } from "@/lib/motion";
import Image from "next/image";

const LINKS = [
  { label: "Instagram", href: SOCIAL.instagram, Icon: FaInstagram },
  { label: "TikTok", href: SOCIAL.tiktok, Icon: FaTiktok },
  { label: "Email", href: SOCIAL.email, Icon: FaEnvelope },
];

export function Navbar() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION_MEDIUM, ease: EASE_LUXURY, delay: 0.1 }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled
          ? "border-b border-border-subtle bg-black/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-5 sm:px-10">
        <a
          href="#top"
          className="flex items-center transition-opacity hover:opacity-80"
        >
          <Image src="/images/logo.PNG" alt={BRAND} width={140} height={140} />
        </a>
        <ul className="flex items-center gap-6 sm:gap-8">
          {LINKS.map(({ label, href, Icon }) => {
            const isMailto = href.startsWith("mailto:");
            return (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  {...(isMailto
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="block text-text-primary/70 transition-colors duration-200 hover:text-gold"
                >
                  <Icon size={16} aria-hidden />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.header>
  );
}
