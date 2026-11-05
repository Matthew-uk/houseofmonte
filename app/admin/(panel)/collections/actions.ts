"use server";

import { revalidatePath } from "next/cache";
import { ForbiddenError, requireAdmin } from "@/lib/auth-guards";
import { CollectionError, saveCollection } from "@/lib/services/collection.service";
import { collectionInput, firstIssue } from "@/lib/validation/catalog";

export type SaveResult = { ok: true } | { ok: false; error: string };

export async function saveCollectionAction(id: string | null, raw: unknown): Promise<SaveResult> {
  let session;
  try {
    session = await requireAdmin();
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return { ok: false, error: "Your session has expired. Log in again in a new tab, then save." };
    }
    throw err;
  }
  if (id !== null && !/^[a-f\d]{24}$/i.test(id)) return { ok: false, error: "Invalid collection." };

  const parsed = collectionInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  try {
    await saveCollection(parsed.data, session.user.id, id ?? undefined);
  } catch (err) {
    if (err instanceof CollectionError) return { ok: false, error: err.message };
    throw err;
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
