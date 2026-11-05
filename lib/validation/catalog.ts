import { z } from "zod";
import { COLLECTION_STATUSES, IMAGE_KINDS, PRODUCT_STATUSES } from "@/lib/catalog-constants";
import { isAllowedImageUrl } from "@/lib/upload";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");
const slug = z.string().trim().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes");
const text = (max: number) => z.string().trim().max(max);
const imageUrl = z.string().refine(isAllowedImageUrl, "Image must come from the upload service");

/** Whole naira as a non-negative integer; money is converted to kobo in the service. */
const naira = z.number().int("Use whole naira").min(0).max(100_000_000);
const quantity = z.number().int("Use whole numbers").min(0).max(1_000_000);

const imageInput = z.object({
  id: objectId.optional(),
  url: imageUrl,
  kind: z.enum(IMAGE_KINDS),
  alt: text(200),
});

const variantInput = z.object({
  id: objectId.optional(),
  size: z.string().trim().min(1, "Size is required").max(20),
  sku: text(60).optional(),
  stock: quantity,
  lowStockThreshold: quantity.optional(),
});

const colorInput = z
  .object({
    id: objectId.optional(),
    name: z.string().trim().min(1, "Colour name is required").max(40),
    hex: z.string().regex(/^#[0-9a-f]{6}$/i, "Use a hex colour like #111111").optional(),
    priceOverrideNaira: naira.optional(),
    images: z.array(imageInput).max(30),
    variants: z.array(variantInput).max(30),
  })
  .superRefine((color, ctx) => {
    const sizes = color.variants.map((v) => v.size.toUpperCase());
    if (new Set(sizes).size !== sizes.length) {
      ctx.addIssue({ code: "custom", message: `${color.name}: each size can only be listed once` });
    }
  });

export const productInput = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    slug: slug.max(140),
    description: text(5000),
    details: text(5000),
    sizeGuide: text(2000),
    category: text(60),
    priceNaira: naira,
    compareAtNaira: naira.optional(),
    collectionIds: z.array(objectId).max(50),
    status: z.enum(PRODUCT_STATUSES),
    sortOrder: z.number().int().min(-100_000).max(100_000),
    colors: z.array(colorInput).max(20),
  })
  .superRefine((product, ctx) => {
    const names = product.colors.map((c) => c.name.toUpperCase());
    if (new Set(names).size !== names.length) {
      ctx.addIssue({ code: "custom", message: "Each colour name can only be used once" });
    }
    if (product.status !== "ACTIVE") return;
    // Drafts can be incomplete; anything visible in the shop can't be.
    if (product.priceNaira === 0) {
      ctx.addIssue({ code: "custom", message: "An active product needs a price" });
    }
    if (product.colors.length === 0) {
      ctx.addIssue({ code: "custom", message: "An active product needs at least one colour" });
    }
    for (const c of product.colors) {
      if (c.images.length === 0) {
        ctx.addIssue({ code: "custom", message: `${c.name}: add at least one image` });
      }
      if (c.variants.length === 0) {
        ctx.addIssue({ code: "custom", message: `${c.name}: add at least one size` });
      }
    }
  });

export type ProductInput = z.infer<typeof productInput>;

export const collectionInput = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  slug: slug.max(140),
  description: text(2000),
  coverImageUrl: imageUrl.nullable(),
  status: z.enum(COLLECTION_STATUSES),
  releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date").nullable(),
  sortOrder: z.number().int().min(-100_000).max(100_000),
});

export type CollectionInput = z.infer<typeof collectionInput>;

export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Check the form and try again.";
}
