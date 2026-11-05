import { requireAdminPage } from "@/lib/auth-guards";
import { products } from "@/lib/models/product";
import { collections } from "@/lib/models/collection";

// Phase 5 replaces this with revenue / orders / low-stock widgets.
export default async function AdminDashboard() {
  // Layouts don't re-run on every navigation, so each admin page checks too.
  await requireAdminPage();
  const [productCount, collectionCount] = await Promise.all([
    products().then((c) => c.countDocuments({ status: { $ne: "ARCHIVED" } })),
    collections().then((c) => c.countDocuments({ status: { $ne: "ARCHIVED" } })),
  ]);

  return (
    <>
      <h1 className="text-title uppercase">Dashboard</h1>
      <dl className="mt-6 grid max-w-md grid-cols-2 gap-px border border-line bg-line">
        <div className="bg-bg p-4">
          <dt className="text-meta uppercase text-muted">Products</dt>
          <dd className="mt-1 text-title">{productCount}</dd>
        </div>
        <div className="bg-bg p-4">
          <dt className="text-meta uppercase text-muted">Collections</dt>
          <dd className="mt-1 text-title">{collectionCount}</dd>
        </div>
      </dl>
    </>
  );
}
