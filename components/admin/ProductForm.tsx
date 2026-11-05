"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveProductAction } from "@/app/admin/(panel)/products/actions";
import { Button } from "@/components/forms/Button";
import { Field, SelectField, TextAreaField } from "@/components/forms/Field";
import { PRODUCT_STATUSES, STANDARD_SIZES, type ProductStatus } from "@/lib/catalog-constants";
import { slugify } from "@/lib/slug";
import { ImageManager, type ImageItem } from "./ImageManager";

export interface VariantValues {
  key: string;
  id?: string;
  size: string;
  sku: string;
  stock: string;
  lowStockThreshold: string;
}

export interface ColorValues {
  key: string;
  id?: string;
  name: string;
  hex: string;
  priceOverride: string;
  images: ImageItem[];
  variants: VariantValues[];
}

export interface ProductFormValues {
  name: string;
  slug: string;
  description: string;
  details: string;
  sizeGuide: string;
  category: string;
  price: string;
  compareAt: string;
  collectionIds: string[];
  status: ProductStatus;
  sortOrder: string;
  colors: ColorValues[];
}

let nextKey = 0;
const newKey = () => `form-${nextKey++}`;

function newColor(): ColorValues {
  return { key: newKey(), name: "", hex: "", priceOverride: "", images: [], variants: [] };
}

function emptyProduct(): ProductFormValues {
  return {
    name: "",
    slug: "",
    description: "",
    details: "",
    sizeGuide: "",
    category: "",
    price: "",
    compareAt: "",
    collectionIds: [],
    status: "DRAFT",
    sortOrder: "0",
    colors: [],
  };
}

const optionalNumber = (v: string) => (v.trim() === "" ? undefined : Number(v));

function toPayload(v: ProductFormValues) {
  return {
    name: v.name,
    slug: v.slug,
    description: v.description,
    details: v.details,
    sizeGuide: v.sizeGuide,
    category: v.category,
    priceNaira: Number(v.price || 0),
    compareAtNaira: optionalNumber(v.compareAt),
    collectionIds: v.collectionIds,
    status: v.status,
    sortOrder: Number(v.sortOrder || 0),
    colors: v.colors.map((c) => ({
      id: c.id,
      name: c.name,
      hex: c.hex.trim() || undefined,
      priceOverrideNaira: optionalNumber(c.priceOverride),
      images: c.images
        .filter((i) => i.status === "done")
        .map((i) => ({ id: i.id, url: i.url, kind: i.kind, alt: i.alt })),
      variants: c.variants.map((s) => ({
        id: s.id,
        size: s.size,
        sku: s.sku.trim() || undefined,
        stock: Number(s.stock || 0),
        lowStockThreshold: optionalNumber(s.lowStockThreshold),
      })),
    })),
  };
}

const SECTION = "mt-8 border-t border-line pt-6";
const SECTION_TITLE = "mb-4 text-ui font-medium uppercase";
const TEXT_BUTTON = "min-h-11 text-meta uppercase hover:underline";
const CELL_INPUT = "h-11 w-full border border-line bg-bg px-2 text-body";

export function ProductForm({
  id,
  initial,
  collections,
}: {
  id: string | null;
  initial?: ProductFormValues;
  collections: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [values, setValues] = useState(() => initial ?? emptyProduct());
  const [slugEdited, setSlugEdited] = useState(id !== null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const updateColor = (key: string, change: (c: ColorValues) => ColorValues) =>
    setValues((v) => ({ ...v, colors: v.colors.map((c) => (c.key === key ? change(c) : c)) }));

  const updateVariant = (colorKey: string, key: string, change: Partial<VariantValues>) =>
    updateColor(colorKey, (c) => ({
      ...c,
      variants: c.variants.map((s) => (s.key === key ? { ...s, ...change } : s)),
    }));

  const addSize = (colorKey: string, size: string) =>
    updateColor(colorKey, (c) => ({
      ...c,
      variants: [
        ...c.variants,
        { key: newKey(), size, sku: "", stock: "0", lowStockThreshold: "" },
      ],
    }));

  const images = values.colors.flatMap((c) => c.images);
  const uploading = images.some((i) => i.status === "uploading");
  const failed = images.some((i) => i.status === "error");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (failed) {
      setError("Retry or remove the images that failed to upload.");
      return;
    }
    setSaving(true);
    try {
      const result = await saveProductAction(id, toPayload(values));
      if (result.ok) {
        router.push("/admin/products");
        return;
      }
      setError(result.error);
    } catch {
      setError("Couldn't save: your session may have expired or the connection dropped. Your changes are still here. Log in again in a new tab, then retry.");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 max-w-4xl pb-24">
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
        <Field
          label="Price (₦)"
          name="price"
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={values.price}
          onChange={(e) => set("price", e.target.value)}
        />
        <Field
          label="Compare-at price (₦, optional)"
          name="compareAt"
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={values.compareAt}
          onChange={(e) => set("compareAt", e.target.value)}
        />
        <Field
          label="Category"
          name="category"
          value={values.category}
          onChange={(e) => set("category", e.target.value)}
        />
        <SelectField
          label="Status"
          name="status"
          value={values.status}
          onChange={(e) => set("status", e.target.value as ProductStatus)}
        >
          {PRODUCT_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </SelectField>
        <Field
          label="Sort order (lower shows first)"
          name="sortOrder"
          type="number"
          step={1}
          value={values.sortOrder}
          onChange={(e) => set("sortOrder", e.target.value)}
        />
      </div>

      <div className="mt-4 grid gap-4">
        <TextAreaField
          label="Description"
          name="description"
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
        />
        <TextAreaField
          label="Fabric & care"
          name="details"
          value={values.details}
          onChange={(e) => set("details", e.target.value)}
        />
        <TextAreaField
          label="Fit / size guide"
          name="sizeGuide"
          rows={2}
          value={values.sizeGuide}
          onChange={(e) => set("sizeGuide", e.target.value)}
        />
      </div>

      <fieldset className={SECTION}>
        <legend className="text-ui font-medium uppercase">Collections</legend>
        {collections.length === 0 ? (
          <p className="mt-2 text-body text-muted">
            No collections yet.{" "}
            <Link href="/admin/collections/new" className="underline">
              Create one
            </Link>
            .
          </p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-x-6">
            {collections.map((c) => (
              <label key={c.id} className="flex min-h-11 items-center gap-2 text-body">
                <input
                  type="checkbox"
                  checked={values.collectionIds.includes(c.id)}
                  onChange={(e) =>
                    set(
                      "collectionIds",
                      e.target.checked
                        ? [...values.collectionIds, c.id]
                        : values.collectionIds.filter((x) => x !== c.id),
                    )
                  }
                />
                {c.name}
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <section className={SECTION} aria-label="Colours">
        <h2 className={SECTION_TITLE}>Colours</h2>
        {values.colors.length === 0 && (
          <p className="mb-4 text-body text-muted">
            Add a colour to upload images and set sizes and stock.
          </p>
        )}

        {values.colors.map((color, index) => (
          <div key={color.key} className="mb-8 border border-line p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Field
                id={`${color.key}-name`}
                label="Colour name"
                name="colorName"
                placeholder="BLACK"
                value={color.name}
                onChange={(e) => updateColor(color.key, (c) => ({ ...c, name: e.target.value }))}
              />
              <Field
                id={`${color.key}-hex`}
                label="Swatch hex (optional)"
                name="colorHex"
                placeholder="#111111"
                value={color.hex}
                onChange={(e) => updateColor(color.key, (c) => ({ ...c, hex: e.target.value }))}
              />
              <Field
                id={`${color.key}-price`}
                label="Price override (₦, optional)"
                name="colorPrice"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={color.priceOverride}
                onChange={(e) =>
                  updateColor(color.key, (c) => ({ ...c, priceOverride: e.target.value }))
                }
              />
            </div>

            <h3 className="mb-2 mt-6 text-meta uppercase text-muted">Images</h3>
            <ImageManager
              label={color.name || `colour ${index + 1}`}
              images={color.images}
              onChange={(updater) =>
                updateColor(color.key, (c) => ({ ...c, images: updater(c.images) }))
              }
            />

            <h3 className="mb-2 mt-6 text-meta uppercase text-muted">Sizes & stock</h3>
            {color.variants.length > 0 && (
              <div className="relative overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-[13px]">
                  <thead className="text-meta uppercase text-muted">
                    <tr>
                      <th scope="col" className="pb-1 pr-2 font-normal">Size</th>
                      <th scope="col" className="pb-1 pr-2 font-normal">Stock</th>
                      <th scope="col" className="pb-1 pr-2 font-normal">SKU</th>
                      <th scope="col" className="pb-1 pr-2 font-normal">Low at</th>
                      <th scope="col" className="pb-1 font-normal"><span className="sr-only">Remove</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {color.variants.map((v) => (
                      <tr key={v.key}>
                        <td className="pb-2 pr-2 font-medium">{v.size}</td>
                        <td className="w-24 pb-2 pr-2">
                          <input
                            aria-label={`Stock for ${v.size}`}
                            type="number"
                            min={0}
                            step={1}
                            inputMode="numeric"
                            className={CELL_INPUT}
                            value={v.stock}
                            onChange={(e) => updateVariant(color.key, v.key, { stock: e.target.value })}
                          />
                        </td>
                        <td className="pb-2 pr-2">
                          <input
                            aria-label={`SKU for ${v.size}`}
                            className={CELL_INPUT}
                            value={v.sku}
                            onChange={(e) => updateVariant(color.key, v.key, { sku: e.target.value })}
                          />
                        </td>
                        <td className="w-24 pb-2 pr-2">
                          <input
                            aria-label={`Low-stock threshold for ${v.size}`}
                            type="number"
                            min={0}
                            step={1}
                            inputMode="numeric"
                            placeholder="3"
                            className={CELL_INPUT}
                            value={v.lowStockThreshold}
                            onChange={(e) =>
                              updateVariant(color.key, v.key, { lowStockThreshold: e.target.value })
                            }
                          />
                        </td>
                        <td className="pb-2 text-right">
                          <button
                            type="button"
                            className={TEXT_BUTTON}
                            onClick={() =>
                              updateColor(color.key, (c) => ({
                                ...c,
                                variants: c.variants.filter((s) => s.key !== v.key),
                              }))
                            }
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {STANDARD_SIZES.filter(
                (size) => !color.variants.some((v) => v.size.toUpperCase() === size),
              ).map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-label={`Add size ${size}`}
                  className="min-h-11 min-w-11 border border-line px-2 text-ui uppercase hover:border-fg"
                  onClick={() => addSize(color.key, size)}
                >
                  + {size}
                </button>
              ))}
              <CustomSize onAdd={(size) => addSize(color.key, size)} />
            </div>

            <button
              type="button"
              className={`${TEXT_BUTTON} mt-4 text-accent`}
              onClick={() =>
                setValues((v) => ({ ...v, colors: v.colors.filter((c) => c.key !== color.key) }))
              }
            >
              Remove colour
            </button>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          className="md:w-auto"
          onClick={() => set("colors", [...values.colors, newColor()])}
        >
          Add colour
        </Button>
      </section>

      <div className="sticky bottom-0 z-10 mt-8 border-t border-line bg-bg py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        {error && (
          <p role="alert" className="mb-2 text-body text-accent">
            {error}
          </p>
        )}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving || uploading} className="md:w-auto">
            {saving ? "Saving…" : uploading ? "Uploading images…" : "Save product"}
          </Button>
          <Link href="/admin/products" className="text-ui uppercase hover:underline">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}

function CustomSize({ onAdd }: { onAdd: (size: string) => void }) {
  const [size, setSize] = useState("");
  const add = () => {
    const value = size.trim().toUpperCase();
    if (value) onAdd(value);
    setSize("");
  };
  return (
    <span className="flex items-center gap-2">
      <input
        aria-label="Custom size"
        placeholder="Custom"
        maxLength={20}
        className="h-11 w-24 border border-line bg-bg px-2 text-body"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
      />
      <button type="button" className={TEXT_BUTTON} onClick={add}>
        Add
      </button>
    </span>
  );
}
