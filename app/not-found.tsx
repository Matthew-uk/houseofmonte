import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        id="main"
        className="flex min-h-[60dvh] flex-col items-center justify-center gap-2 px-3 text-center"
      >
        <h1 className="text-title uppercase">Page not found</h1>
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center text-ui uppercase underline-offset-4 hover:underline"
        >
          Back to shop
        </Link>
      </main>
      <Footer />
    </>
  );
}
