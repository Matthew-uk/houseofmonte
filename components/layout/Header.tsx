import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

const NAV_LINK =
  "inline-flex min-h-11 items-center text-ui font-medium uppercase transition-opacity duration-150 hover:opacity-70";

// DESIGN.md §5 Header: logo on top on mobile, one quiet row of links beneath;
// logo left with links right from md. EVENT and CART return with the Face of
// MONTÈ page and checkout.
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg">
      <div className="flex flex-col items-center gap-1 px-3 pt-4 md:flex-row md:justify-between md:px-4 md:py-3 xl:px-6">
        <Logo className="w-36 md:w-44" sizes="(min-width: 768px) 176px, 144px" />
        <nav aria-label="Primary">
          <ul className="flex items-center gap-8">
            <li>
              <Link href="/shop" className={NAV_LINK}>
                Shop
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
