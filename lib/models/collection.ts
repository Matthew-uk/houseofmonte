import type { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/db";
import type { ImageAsset } from "@/lib/models/product";

export const COLLECTION_STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;
export type CollectionStatus = (typeof COLLECTION_STATUSES)[number];

export interface CollectionDoc {
  _id: ObjectId;
  name: string;
  slug: string; // unique
  description: string;
  coverImage: ImageAsset | null;
  status: CollectionStatus;
  releaseDate: Date | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function collections(): Promise<Collection<CollectionDoc>> {
  return (await getDb()).collection<CollectionDoc>("collections");
}
