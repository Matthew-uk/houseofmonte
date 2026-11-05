import Link from "next/link";
import { requireAdminPage } from "@/lib/auth-guards";
import { collections } from "@/lib/models/collection";
import { products } from "@/lib/models/product";
import { listLowStock } from "@/lib/services/product.service";

export default async function AdminDashboard() {
  // Layouts don't re-run on every navigation, so each admin page checks too.
  await requireAdminPage();
  const [active, drafts, collectionCount, lowStock] = await Promise.all([
    products().then((c) => c.countDocuments({ status: "ACTIVE" })),
    products().then((c) => c.countDocuments({ status: "DRAFT" })),
    collections().then((c) => c.countDocuments({ status: "ACTIVE" })),
    listLowStock(),
  ]);

  const stats = [
    { label: "Active products", value: active },
    { label: "Drafts", value: drafts },
    { label: "Active collections", value: collectionCount },
  ];

  return (
    <>
      <h1 className="text-title uppercase">Dashboard</h1>
      <dl className="mt-6 grid max-w-xl grid-cols-3 gap-px border border-line bg-line">
        {stats.map((s) => (
          <div key={s.label} className="bg-bg p-4">
            <dt className="text-meta uppercase text-muted">{s.label}</dt>
            <dd className="mt-1 text-title">{s.value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 text-ui font-medium uppercase">Low stock</h2>
      {lowStock.length === 0 ? (
        <p className="mt-2 text-body text-muted">Nothing is running low.</p>
      ) : (
        <div className="mt-2 max-w-xl overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="text-meta uppercase text-muted">
              <tr className="border-b border-line">
                <th scope="col" className="py-2 pr-4 font-normal">Product</th>
                <th scope="col" className="py-2 pr-4 font-normal">Colour</th>
                <th scope="col" className="py-2 pr-4 font-normal">Size</th>
                <th scope="col" className="py-2 font-normal">Left</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((r) => (
                <tr key={`${r.productId}-${r.color}-${r.size}`} className="border-b border-line">
                  <td className="py-2 pr-4">
                    <Link href={`/admin/products/${r.productId}`} className="hover:underline">
                      {r.name}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">{r.color}</td>
                  <td className="py-2 pr-4">{r.size}</td>
                  <td className={`py-2 ${r.available === 0 ? "text-accent" : ""}`}>{r.available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
