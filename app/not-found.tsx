import type { Metadata } from "next";
import Link from "next/link";
import { GoldDivider } from "@/components/ui/GoldDivider";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-[11px] uppercase tracking-mega text-[#B8965A]">404</p>
      <h1 className="mt-6 font-display text-4xl uppercase tracking-wide text-white md:text-5xl">
        Page Not Found
      </h1>
      <GoldDivider className="mt-8" />
      <p className="mt-8 max-w-sm text-[15px] leading-8 text-[#C8C8C8]">
        The page you are looking for doesn’t exist. Return to Monte Deluxe —
        luxury fashion from Port Harcourt, Nigeria.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-button border border-[#B8965A] px-8 py-3 text-[11px] uppercase tracking-wider text-[#B8965A] transition-colors duration-300 hover:bg-[#B8965A] hover:text-black"
      >
        Back to Home
      </Link>
    </main>
  );
}
