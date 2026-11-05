import type { ProductTile as Tile } from "@/lib/services/product.service";
import { ProductTile } from "./ProductTile";

export function ProductGrid({ products }: { products: Tile[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-0.5 gap-y-6 md:grid-cols-3 xl:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.id}>
          {/* The first row holds the LCP image at every breakpoint. */}
          <ProductTile product={p} preload={i < 2} />
        </li>
      ))}
    </ul>
  );
}
