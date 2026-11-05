import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import logo from "@/public/images/logo-black.png";

// The MONTÈ logo as a link. Callers set the width through className and pass
// a matching `sizes`.
export function Logo({
  className,
  sizes,
  href = "/",
  label = `${BRAND} — home`,
}: {
  className: string;
  sizes: string;
  href?: string;
  label?: string;
}) {
  return (
    <Link href={href} aria-label={label} className={`block ${className}`}>
      <Image src={logo} alt={BRAND} sizes={sizes} className="h-auto w-full" />
    </Link>
  );
}
