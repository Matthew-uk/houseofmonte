import type { Collection, ObjectId } from "mongodb";
import type { CollectionStatus } from "@/lib/catalog-constants";
import { getDb } from "@/lib/db";
import type { ImageAsset } from "@/lib/models/product";

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
