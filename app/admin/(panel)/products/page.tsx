import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireAdminPage } from "@/lib/auth-guards";
import { formatNaira } from "@/lib/money";
import { available } from "@/lib/models/product";
import { listAdminProducts } from "@/lib/services/product.service";
import { duplicateAction, setStatusAction } from "./actions";

export const metadata: Metadata = { title: "Products" };

const ACTION = "min-h-9 text-left hover:underline";

export default async function ProductsPage() {
  await requireAdminPage("/admin/products");
  const items = await listAdminProducts();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-title uppercase">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex h-11 items-center bg-fg px-4 text-ui font-medium uppercase text-inverse hover:opacity-85"
        >
          New product
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-8 text-body text-muted">No products yet. Create the first one.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="text-meta uppercase text-muted">
              <tr className="border-b border-line">
                <th scope="col" className="py-2 pr-4 font-normal">Product</th>
                <th scope="col" className="py-2 pr-4 font-normal">Status</th>
                <th scope="col" className="py-2 pr-4 font-normal">Price</th>
                <th scope="col" className="py-2 pr-4 font-normal">Colours</th>
                <th scope="col" className="py-2 pr-4 font-normal">Stock</th>
                <th scope="col" className="py-2 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => {
                const id = p._id.toHexString();
                const cover = p.colors[0]?.images[0];
                const stock = p.colors
                  .flatMap((c) => c.variants)
                  .reduce((sum, v) => sum + available(v), 0);
                return (
                  <tr key={id} className="border-b border-line hover:bg-surface">
                    <td className="py-2 pr-4">
                      <Link href={`/admin/products/${id}`} className="flex items-center gap-3 hover:underline">
                        <span className="relative block aspect-[4/5] w-10 shrink-0 bg-surface">
                          {cover && <Image src={cover.url} alt="" fill sizes="40px" className="object-cover" />}
                        </span>
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-2 pr-4">{p.status}</td>
                    <td className="py-2 pr-4">{formatNaira(p.price)}</td>
                    <td className="py-2 pr-4">{p.colors.length}</td>
                    <td className={`py-2 pr-4 ${stock === 0 ? "text-accent" : ""}`}>{stock}</td>
                    <td className="py-2">
                      <div className="flex gap-3">
                        <form action={duplicateAction.bind(null, id)}>
                          <button type="submit" className={ACTION}>Duplicate</button>
                        </form>
                        <form
                          action={setStatusAction.bind(
                            null,
                            id,
                            p.status === "ARCHIVED" ? "DRAFT" : "ARCHIVED",
                          )}
                        >
                          <button type="submit" className={ACTION}>
                            {p.status === "ARCHIVED" ? "Restore" : "Archive"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
