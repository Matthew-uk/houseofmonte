import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireAdminPage } from "@/lib/auth-guards";
import { listCollections } from "@/lib/services/collection.service";

export const metadata: Metadata = { title: "Collections" };

export default async function CollectionsPage() {
  await requireAdminPage("/admin/collections");
  const items = await listCollections();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-title uppercase">Collections</h1>
        <Link
          href="/admin/collections/new"
          className="inline-flex h-11 items-center bg-fg px-4 text-ui font-medium uppercase text-inverse hover:opacity-85"
        >
          New collection
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="mt-8 text-body text-muted">No collections yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-[13px]">
            <thead className="text-meta uppercase text-muted">
              <tr className="border-b border-line">
                <th scope="col" className="py-2 pr-4 font-normal">Name</th>
                <th scope="col" className="py-2 pr-4 font-normal">Status</th>
                <th scope="col" className="py-2 pr-4 font-normal">Slug</th>
                <th scope="col" className="py-2 font-normal">Sort</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c._id.toHexString()} className="border-b border-line hover:bg-surface">
                  <td className="py-2 pr-4">
                    <Link
                      href={`/admin/collections/${c._id.toHexString()}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <span className="relative block aspect-[4/5] w-10 shrink-0 bg-surface">
                        {c.coverImage && (
                          <Image src={c.coverImage.url} alt="" fill sizes="40px" className="object-cover" />
                        )}
                      </span>
                      {c.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">{c.status}</td>
                  <td className="py-3 pr-4 text-muted">{c.slug}</td>
                  <td className="py-3">{c.sortOrder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
