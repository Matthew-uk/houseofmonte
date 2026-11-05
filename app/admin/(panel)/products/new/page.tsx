import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth-guards";
import { listCollections } from "@/lib/services/collection.service";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAdminPage("/admin/products/new");
  const collections = await listCollections();
  return (
    <>
      <h1 className="text-title uppercase">New product</h1>
      <ProductForm
        id={null}
        collections={collections.map((c) => ({ id: c._id.toHexString(), name: c.name }))}
      />
    </>
  );
}
