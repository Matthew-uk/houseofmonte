import type { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/db";

export const PRODUCT_STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const IMAGE_KINDS = ["FRONT", "BACK", "DETAIL", "MODEL", "OTHER"] as const;
export type ImageKind = (typeof IMAGE_KINDS)[number];

export const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "ONE SIZE"] as const;

/** A stored image (Cloudinary). `url` is the delivery URL of the original. */
export interface ImageAsset {
  url: string;
  publicId: string;
  width: number;
  height: number;
  alt: string;
  blurDataUrl?: string;
}

export interface ProductImage extends ImageAsset {
  _id: ObjectId;
  kind: ImageKind;
  sortOrder: number;
}

/** One size of one colour — the purchasable unit. */
export interface Variant {
  _id: ObjectId;
  size: string;
  sku?: string;
  stock: number; // on hand, integer >= 0
  reserved: number; // held by pending checkouts, 0 <= reserved <= stock
  lowStockThreshold?: number;
}

export interface ProductColor {
  _id: ObjectId;
  name: string; // "BLACK"
  slug: string; // "black", used in ?color=
  hex?: string;
  priceOverride?: number; // kobo
  sortOrder: number;
  images: ProductImage[]; // ordered by sortOrder; [0] is the cover
  variants: Variant[];
}

export interface ProductDoc {
  _id: ObjectId;
  name: string;
  slug: string; // unique
  description: string;
  details: string; // fabric & care, plain text with line breaks
  sizeGuide: string;
  category: string;
  price: number; // kobo
  compareAtPrice?: number; // kobo
  collectionIds: ObjectId[];
  status: ProductStatus;
  sortOrder: number;
  colors: ProductColor[];
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_LOW_STOCK_THRESHOLD = 3;

export function available(v: Pick<Variant, "stock" | "reserved">): number {
  return Math.max(0, v.stock - v.reserved);
}

export function colorPrice(p: Pick<ProductDoc, "price">, c: Pick<ProductColor, "priceOverride">) {
  return c.priceOverride ?? p.price;
}

export async function products(): Promise<Collection<ProductDoc>> {
  return (await getDb()).collection<ProductDoc>("products");
}
