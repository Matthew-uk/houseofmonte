import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth-guards";
import { koboToWholeNaira } from "@/lib/money";
import { listCollections } from "@/lib/services/collection.service";
import { getProductById } from "@/lib/services/product.service";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdminPage(`/admin/products/${id}`);
  const [product, collections] = await Promise.all([getProductById(id), listCollections()]);
  if (!product) notFound();

  // Plain JSON only: ObjectIds and Dates can't cross into a client component.
  const initial: ProductFormValues = {
    name: product.name,
    slug: product.slug,
    description: product.description,
    details: product.details,
    sizeGuide: product.sizeGuide,
    category: product.category,
    price: String(koboToWholeNaira(product.price)),
    compareAt: product.compareAtPrice ? String(koboToWholeNaira(product.compareAtPrice)) : "",
    collectionIds: product.collectionIds.map((c) => c.toHexString()),
    status: product.status,
    sortOrder: String(product.sortOrder),
    colors: product.colors.map((c) => ({
      key: c._id.toHexString(),
      id: c._id.toHexString(),
      name: c.name,
      hex: c.hex ?? "",
      priceOverride: c.priceOverride ? String(koboToWholeNaira(c.priceOverride)) : "",
      images: c.images.map((i) => ({
        key: i._id.toHexString(),
        id: i._id.toHexString(),
        url: i.url,
        kind: i.kind,
        alt: i.alt,
        status: "done" as const,
      })),
      variants: c.variants.map((v) => ({
        key: v._id.toHexString(),
        id: v._id.toHexString(),
        size: v.size,
        sku: v.sku ?? "",
        stock: String(v.stock),
        lowStockThreshold: v.lowStockThreshold !== undefined ? String(v.lowStockThreshold) : "",
      })),
    })),
  };

  return (
    <>
      <h1 className="text-title uppercase">{product.name}</h1>
      <ProductForm
        id={id}
        initial={initial}
        collections={collections.map((c) => ({ id: c._id.toHexString(), name: c.name }))}
      />
    </>
  );
}
