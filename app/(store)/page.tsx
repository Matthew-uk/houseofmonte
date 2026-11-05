import { connection } from "next/server";
import { CollectionCard } from "@/components/store/CollectionCard";
import { ProductGrid } from "@/components/store/ProductGrid";
import { listActiveCollections } from "@/lib/services/collection.service";
import { listStoreProducts } from "@/lib/services/product.service";

// No hero and no intro: the first thing below the header is clothing.
export default async function Home() {
  await connection(); // admin edits must show immediately, and builds need no DB
  const [products, collections] = await Promise.all([
    listStoreProducts(),
    listActiveCollections(),
  ]);

  if (products.length === 0) {
    return (
      <section className="flex min-h-[60dvh] items-center justify-center px-3">
        <p className="text-ui uppercase">New pieces coming soon</p>
      </section>
    );
  }

  const withCovers = collections.filter((c) => c.coverImage);
  return (
    <>
      <section aria-label="Latest products" className="px-3 pt-3 md:px-4 xl:px-6">
        <h1 className="sr-only">MONTÈ — latest pieces</h1>
        <ProductGrid products={products} />
      </section>
      {withCovers.length > 0 && (
        <section className="mt-16 px-3 md:px-4 xl:px-6">
          <h2 className="mb-3 text-title uppercase">Collections</h2>
          <ul className="grid grid-cols-2 gap-x-0.5 gap-y-6 md:grid-cols-3">
            {withCovers.map((c) => (
              <li key={c.slug}>
                <CollectionCard name={c.name} slug={c.slug} cover={c.coverImage!} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
