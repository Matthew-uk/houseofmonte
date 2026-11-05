"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveCollectionAction } from "@/app/admin/(panel)/collections/actions";
import { Button } from "@/components/forms/Button";
import { Field, SelectField, TextAreaField } from "@/components/forms/Field";
import { COLLECTION_STATUSES, type CollectionStatus } from "@/lib/catalog-constants";
import { slugify } from "@/lib/slug";
import { ACCEPTED_IMAGE_TYPES, imageFileProblem, uploadImage } from "@/lib/upload";

export interface CollectionFormValues {
  name: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  status: CollectionStatus;
  releaseDate: string;
  sortOrder: string;
}

export function CollectionForm({
  id,
  initial,
}: {
  id: string | null;
  initial: CollectionFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [slugEdited, setSlugEdited] = useState(id !== null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof CollectionFormValues>(key: K, value: CollectionFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  async function onCover(file: File | undefined) {
    if (!file) return;
    const problem = imageFileProblem(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setUploading(true);
    try {
      set("coverImageUrl", await uploadImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
    setUploading(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const result = await saveCollectionAction(id, {
        name: values.name,
        slug: values.slug,
        description: values.description,
        coverImageUrl: values.coverImageUrl,
        status: values.status,
        releaseDate: values.releaseDate || null,
        sortOrder: Number(values.sortOrder || 0),
      });
      if (result.ok) {
        router.push("/admin/collections");
        return;
      }
      setError(result.error);
    } catch {
      setError("Couldn't save: your session may have expired or the connection dropped. Your changes are still here. Log in again in a new tab, then retry.");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 flex max-w-2xl flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Name"
          name="name"
          required
          value={values.name}
          onChange={(e) => {
            const name = e.target.value;
            setValues((v) => ({ ...v, name, slug: slugEdited ? v.slug : slugify(name) }));
          }}
        />
        <Field
          label="Slug (URL)"
          name="slug"
          required
          value={values.slug}
          onChange={(e) => {
            setSlugEdited(true);
            set("slug", e.target.value);
          }}
        />
        <SelectField
          label="Status"
          name="status"
          value={values.status}
          onChange={(e) => set("status", e.target.value as CollectionStatus)}
        >
          {COLLECTION_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </SelectField>
        <Field
          label="Release date (optional)"
          name="releaseDate"
          type="date"
          value={values.releaseDate}
          onChange={(e) => set("releaseDate", e.target.value)}
        />
        <Field
          label="Sort order (lower shows first)"
          name="sortOrder"
          type="number"
          step={1}
          value={values.sortOrder}
          onChange={(e) => set("sortOrder", e.target.value)}
        />
      </div>
      <TextAreaField
        label="Description"
        name="description"
        value={values.description}
        onChange={(e) => set("description", e.target.value)}
      />

      <div>
        <p className="mb-1 text-meta uppercase text-muted">Cover image (optional)</p>
        {values.coverImageUrl && (
          <div className="relative mb-2 aspect-[4/5] w-40 bg-surface">
            <Image src={values.coverImageUrl} alt="" fill sizes="160px" className="object-cover" />
          </div>
        )}
        <div className="flex items-center gap-4">
          <label className="inline-flex min-h-11 cursor-pointer items-center border border-fg px-4 text-ui uppercase focus-within:outline-2 focus-within:outline-offset-2">
            {uploading ? "Uploading…" : values.coverImageUrl ? "Replace" : "Upload"}
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              className="sr-only"
              disabled={uploading}
              onChange={(e) => {
                void onCover(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          {values.coverImageUrl && (
            <button
              type="button"
              className="min-h-11 text-meta uppercase hover:underline"
              onClick={() => set("coverImageUrl", null)}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="text-body text-accent">
          {error}
        </p>
      )}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving || uploading} className="md:w-auto">
          {saving ? "Saving…" : "Save collection"}
        </Button>
        <Link href="/admin/collections" className="text-ui uppercase hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
