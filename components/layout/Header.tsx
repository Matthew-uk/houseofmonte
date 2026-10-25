import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import logo from "@/public/images/logo-black.png";

const NAV_LINK =
  "inline-flex min-h-11 items-center text-ui font-medium uppercase transition-opacity duration-150 hover:opacity-70";

// DESIGN.md §5 Header: logo on top on mobile, one quiet row of links beneath;
// logo left with links right from md. The cart control becomes the drawer
// trigger in Phase 3; until then it links to /cart.
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg">
      <div className="flex flex-col items-center gap-1 px-3 pt-4 md:flex-row md:justify-between md:px-4 md:py-3 xl:px-6">
        <Link href="/" aria-label={`${BRAND} — home`} className="block">
          <Image
            src={logo}
            alt={BRAND}
            priority
            sizes="(min-width: 768px) 176px, 144px"
            className="h-auto w-36 md:w-44"
          />
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-8">
            <li>
              <Link href="/shop" className={NAV_LINK}>
                Shop
              </Link>
            </li>
            <li>
              <Link href="/face-of-monte" className={NAV_LINK}>
                Event
              </Link>
            </li>
            <li>
              <Link href="/cart" className={NAV_LINK}>
                Cart (0)
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
