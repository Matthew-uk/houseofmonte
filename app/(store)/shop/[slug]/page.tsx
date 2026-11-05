import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Gallery } from "@/components/store/Gallery";
import { SizePicker } from "@/components/store/SizePicker";
import { formatNaira } from "@/lib/money";
import {
  available,
  colorPrice,
  DEFAULT_LOW_STOCK_THRESHOLD,
  type ProductColor,
  type ProductDoc,
} from "@/lib/models/product";
import { getStoreProduct } from "@/lib/services/product.service";
import { BRAND } from "@/lib/constants";
import { SITE_URL } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ color?: string | string[] }>;
}

function colorInStock(c: ProductColor) {
  return c.variants.some((v) => available(v) > 0);
}

function pickColor(p: ProductDoc, requested: string | string[] | undefined) {
  return (
    p.colors.find((c) => c.slug === requested) ?? p.colors.find(colorInStock) ?? p.colors[0]
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const product = await getStoreProduct(slug);
  if (!product) return { title: "Not found", robots: { index: false, follow: false } };

  const cover = product.colors[0]?.images[0];
  const description = product.description.slice(0, 160) || `${product.name} by ${BRAND}.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      ...(cover && { images: [{ url: cover.url, alt: cover.alt }] }),
    },
  };
}

function ProductJsonLd({ product, color }: { product: ProductDoc; color: ProductColor }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: BRAND },
    image: product.colors.flatMap((c) => c.images.map((i) => new URL(i.url, SITE_URL).href)),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${product.slug}`,
      priceCurrency: "NGN",
      price: colorPrice(product, color) / 100,
      availability: product.colors.some(colorInStock)
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
    },
  };
  return (
    <script
      type="application/ld+json"
      // Admin-entered text: escape "<" so it can't close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default async function ProductPage({ params, searchParams }: Props) {
  await connection();
  const [{ slug }, { color: requested }] = await Promise.all([params, searchParams]);
  const product = await getStoreProduct(slug);
  if (!product) notFound();

  const color = pickColor(product, requested);
  if (!color) notFound();

  const details = [
    { title: "Fabric & care", body: product.details },
    { title: "Fit & size guide", body: product.sizeGuide },
  ].filter((d) => d.body);

  return (
    <article className="md:grid md:grid-cols-[3fr_2fr]">
      <Gallery
        key={color.slug}
        label={`${product.name} in ${color.name}`}
        images={color.images.map((i) => ({
          id: i._id.toHexString(),
          url: i.url,
          alt: i.alt,
          blurDataUrl: i.blurDataUrl,
        }))}
      />

      <div className="px-3 pt-4 md:sticky md:top-24 md:self-start md:px-6 md:pt-6">
        <h1 className="text-title uppercase">{product.name}</h1>
        <p className="mt-1 text-ui">{formatNaira(colorPrice(product, color))}</p>

        {product.colors.length > 1 && (
          <ul aria-label="Colour" className="mt-6 flex flex-wrap gap-x-4">
            {product.colors.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop/${product.slug}?color=${c.slug}`}
                  scroll={false}
                  aria-current={c.slug === color.slug ? "true" : undefined}
                  className={`inline-flex min-h-11 items-center gap-2 text-ui uppercase underline-offset-4 ${
                    c.slug === color.slug ? "underline" : "text-muted hover:text-fg"
                  }`}
                >
                  {c.hex && (
                    <span aria-hidden className="size-2.5 border border-line" style={{ background: c.hex }} />
                  )}
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <SizePicker
          key={color.slug}
          productName={product.name}
          colorName={color.name}
          sizes={color.variants.map((v) => ({
            id: v._id.toHexString(),
            size: v.size,
            available: available(v),
            lowAt: v.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD,
          }))}
        />

        {product.description && (
          <p className="mt-6 max-w-[60ch] whitespace-pre-line text-body">{product.description}</p>
        )}
        {details.map((d) => (
          <details key={d.title} className="mt-4 border-t border-line pt-1">
            <summary className="flex min-h-11 cursor-pointer items-center text-ui uppercase">
              {d.title}
            </summary>
            <p className="max-w-[60ch] whitespace-pre-line pb-3 text-body">{d.body}</p>
          </details>
        ))}
      </div>

      <ProductJsonLd product={product} color={color} />
    </article>
  );
}
