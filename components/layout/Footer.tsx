import Link from "next/link";
import { BRAND, SOCIAL } from "@/lib/constants";

const LINK =
  "inline-flex min-h-11 items-center transition-opacity duration-150 hover:opacity-70";

const INTERNAL = [
  { href: "/shipping-returns", label: "Shipping & Returns" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/account", label: "Account" },
];

// DESIGN.md §5 Footer: one quiet block of meta-size links.
export function Footer() {
  return (
    <footer className="mt-16 border-t border-line px-3 py-6 md:px-4 xl:px-6">
      <ul className="flex flex-wrap items-center gap-x-6 text-meta uppercase text-muted">
        <li>
          <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className={LINK}>
            Instagram
          </a>
        </li>
        <li>
          <a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" className={LINK}>
            TikTok
          </a>
        </li>
        <li>
          <a href={`mailto:${SOCIAL.email}`} className={LINK}>
            {SOCIAL.email}
          </a>
        </li>
        {INTERNAL.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={LINK}>
              {l.label}
            </Link>
          </li>
        ))}
        <li className="inline-flex min-h-11 items-center">
          © {new Date().getFullYear()} {BRAND}
        </li>
      </ul>
    </footer>
  );
}
