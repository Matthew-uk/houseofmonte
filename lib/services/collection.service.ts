import "server-only";
import { MongoServerError, ObjectId } from "mongodb";
import { auditLogs } from "@/lib/models/audit-log";
import { collections, type CollectionDoc } from "@/lib/models/collection";
import type { CollectionInput } from "@/lib/validation/catalog";

export class CollectionError extends Error {}

const SORT = { sortOrder: 1, createdAt: -1 } as const;

export async function listCollections(): Promise<CollectionDoc[]> {
  return (await collections()).find({}).sort(SORT).toArray();
}

export async function listActiveCollections(): Promise<CollectionDoc[]> {
  return (await collections()).find({ status: "ACTIVE" }).sort(SORT).toArray();
}

export async function getCollectionById(id: string): Promise<CollectionDoc | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  return (await collections()).findOne({ _id: new ObjectId(id) });
}

export async function saveCollection(
  input: CollectionInput,
  actorId: string,
  id?: string,
): Promise<string> {
  const col = await collections();
  const now = new Date();
  const fields = {
    name: input.name,
    slug: input.slug,
    description: input.description,
    coverImage: input.coverImageUrl ? { url: input.coverImageUrl, alt: input.name } : null,
    status: input.status,
    releaseDate: input.releaseDate ? new Date(`${input.releaseDate}T00:00:00+01:00`) : null,
    sortOrder: input.sortOrder,
    updatedAt: now,
  };

  try {
    let entityId = id;
    if (id) {
      const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: fields });
      if (res.matchedCount === 0) throw new CollectionError("This collection no longer exists.");
    } else {
      const res = await col.insertOne({ _id: new ObjectId(), ...fields, createdAt: now });
      entityId = res.insertedId.toHexString();
    }
    await (await auditLogs()).insertOne({
      actorId,
      action: id ? "collection.update" : "collection.create",
      entity: "collections",
      entityId: entityId!,
      createdAt: now,
    });
    return entityId!;
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new CollectionError("That slug is already used by another collection.");
    }
    throw err;
  }
}
