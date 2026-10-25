import Link from "next/link";

// Phase 2 replaces this with the product grid (DESIGN.md §5 Product grid).
// Until products exist, the home page shows the empty state (DESIGN.md §6).
export default function Home() {
  return (
    <section className="flex min-h-[60dvh] items-center justify-center px-3">
      <p className="text-ui uppercase">
        New pieces coming soon —{" "}
        <Link href="/face-of-monte" className="underline-offset-4 hover:underline">
          Face of MONTÈ
        </Link>
      </p>
    </section>
  );
}
