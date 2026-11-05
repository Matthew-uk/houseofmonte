import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { BRAND } from "@/lib/constants";

const HEADING = "mb-2 text-meta uppercase text-muted";

// DESIGN.md §5 Footer: a designed close, with the logo returning large.
export function Footer() {
  return (
    <footer className="mt-20 border-t border-line px-3 pt-10 md:px-4 xl:px-6">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between">
        <Logo className="w-56 md:w-72 xl:w-96" sizes="(min-width: 1280px) 384px, (min-width: 768px) 288px, 224px" />
        <div className="grid gap-8 sm:grid-cols-2 md:gap-16">
          <nav aria-label="Footer">
            <h2 className={HEADING}>Shop</h2>
            <Link
              href="/shop"
              className="inline-flex min-h-11 items-center text-ui uppercase transition-opacity duration-150 hover:opacity-70"
            >
              All pieces
            </Link>
          </nav>
          <div>
            <h2 className={HEADING}>Contact</h2>
            <SocialLinks />
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-line py-4 text-meta uppercase text-muted">
        <p>
          © {new Date().getFullYear()} {BRAND}
        </p>
        <p>Port Harcourt, Nigeria</p>
      </div>
    </footer>
  );
}
