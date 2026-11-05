import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth-guards";
import { getCollectionById } from "@/lib/services/collection.service";
import { CollectionForm } from "@/components/admin/CollectionForm";

export const metadata: Metadata = { title: "Edit collection" };

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdminPage(`/admin/collections/${id}`);
  const c = await getCollectionById(id);
  if (!c) notFound();

  return (
    <>
      <h1 className="text-title uppercase">{c.name}</h1>
      <CollectionForm
        id={id}
        initial={{
          name: c.name,
          slug: c.slug,
          description: c.description,
          coverImageUrl: c.coverImage?.url ?? null,
          status: c.status,
          // Stored as midnight WAT; shift back by the UTC+1 offset for the date input.
          releaseDate: c.releaseDate
            ? new Date(c.releaseDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 10)
            : "",
          sortOrder: String(c.sortOrder),
        }}
      />
    </>
  );
}
