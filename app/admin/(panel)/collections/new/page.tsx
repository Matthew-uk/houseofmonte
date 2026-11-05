import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/auth-guards";
import { CollectionForm } from "@/components/admin/CollectionForm";

export const metadata: Metadata = { title: "New collection" };

export default async function NewCollectionPage() {
  await requireAdminPage("/admin/collections/new");
  return (
    <>
      <h1 className="text-title uppercase">New collection</h1>
      <CollectionForm
        id={null}
        initial={{
          name: "",
          slug: "",
          description: "",
          coverImageUrl: null,
          status: "DRAFT",
          releaseDate: "",
          sortOrder: "0",
        }}
      />
    </>
  );
}
