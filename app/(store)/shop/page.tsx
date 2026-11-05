import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ProductGrid } from "@/components/store/ProductGrid";
import { listActiveCollections } from "@/lib/services/collection.service";
import { listStoreProducts } from "@/lib/services/product.service";

export const metadata: Metadata = {
  title: "Shop",
  description: "All MONTÈ pieces.",
  alternates: { canonical: "/shop" },
};

const LINK = "inline-flex min-h-11 items-center text-ui uppercase hover:opacity-70";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string | string[] }>;
}) {
  await connection();
  const { collection } = await searchParams;
  const collections = await listActiveCollections();
  const current = collections.find((c) => c.slug === collection);
  const products = await listStoreProducts(current?._id);

  return (
    <section className="px-3 md:px-4 xl:px-6">
      <h1 className="pt-6 text-title uppercase">{current?.name ?? "Shop"}</h1>
      {current?.description && (
        <p className="mt-1 max-w-[60ch] text-body text-muted">{current.description}</p>
      )}
      {collections.length > 0 && (
        <nav aria-label="Collections">
          <ul className="mt-2 flex flex-wrap gap-x-4">
            <li>
              <Link
                href="/shop"
                aria-current={current ? undefined : "page"}
                className={`${LINK} ${current ? "text-muted" : "underline underline-offset-4"}`}
              >
                All
              </Link>
            </li>
            {collections.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop?collection=${c.slug}`}
                  aria-current={current?.slug === c.slug ? "page" : undefined}
                  className={`${LINK} ${current?.slug === c.slug ? "underline underline-offset-4" : "text-muted"}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {products.length === 0 ? (
        <p className="flex min-h-[50dvh] items-center justify-center text-ui uppercase">
          Nothing here yet
        </p>
      ) : (
        <div className="pt-2">
          <ProductGrid products={products} />
        </div>
      )}
    </section>
  );
}
