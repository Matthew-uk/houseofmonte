import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/money";
import type { ProductTile as Tile } from "@/lib/services/product.service";

const SIZES = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw";

// DESIGN.md §5 Product tile. The whole tile is one link; the second image fades
// in on hover only on devices that can hover.
export function ProductTile({ product, preload }: { product: Tile; preload?: boolean }) {
  const { image, hoverImage, soldOut } = product;
  const swatches = product.colors.length > 1 ? product.colors.filter((c) => c.hex) : [];
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {image && (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes={SIZES}
            preload={preload}
            placeholder={image.blurDataUrl ? "blur" : "empty"}
            blurDataURL={image.blurDataUrl}
            className={`object-cover ${soldOut ? "opacity-60" : ""}`}
          />
        )}
        {hoverImage && !soldOut && (
          <Image
            src={hoverImage.url}
            alt=""
            fill
            sizes={SIZES}
            className="hidden object-cover opacity-0 transition-opacity duration-200 [@media(hover:hover)]:block [@media(hover:hover)]:group-hover:opacity-100"
          />
        )}
      </div>
      <div className="flex flex-col gap-1 px-1 pt-2 md:flex-row md:items-baseline md:justify-between md:gap-3">
        <h2 className="text-ui font-medium uppercase underline-offset-4 group-hover:underline">
          {product.name}
        </h2>
        {soldOut ? (
          <p className="shrink-0 text-ui uppercase text-accent">Sold out</p>
        ) : (
          <p className="shrink-0 text-ui text-muted">{formatNaira(product.price)}</p>
        )}
      </div>
      {swatches.length > 0 && (
        <p className="flex items-center gap-1 px-1 pt-2">
          <span className="sr-only">Colours: {swatches.map((c) => c.name).join(", ")}</span>
          {swatches.map((c) => (
            <span
              key={c.name}
              aria-hidden
              className="size-2.5 border border-line"
              style={{ background: c.hex }}
            />
          ))}
        </p>
      )}
    </Link>
  );
}
