"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ForbiddenError, requireAdmin } from "@/lib/auth-guards";
import {
  duplicateProduct,
  ProductError,
  saveProduct,
  setProductStatus,
} from "@/lib/services/product.service";
import { firstIssue, productInput } from "@/lib/validation/catalog";
import { PRODUCT_STATUSES, type ProductStatus } from "@/lib/catalog-constants";

export type SaveResult = { ok: true } | { ok: false; error: string };

const OBJECT_ID = /^[a-f\d]{24}$/i;

function refresh() {
  revalidatePath("/", "layout");
}

export async function saveProductAction(id: string | null, raw: unknown): Promise<SaveResult> {
  let session;
  try {
    session = await requireAdmin();
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return { ok: false, error: "Your session has expired. Log in again in a new tab, then save." };
    }
    throw err;
  }
  if (id !== null && !OBJECT_ID.test(id)) return { ok: false, error: "Invalid product." };

  const parsed = productInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

  try {
    await saveProduct(parsed.data, session.user.id, id ?? undefined);
  } catch (err) {
    if (err instanceof ProductError) return { ok: false, error: err.message };
    throw err;
  }
  refresh();
  return { ok: true };
}

export async function setStatusAction(id: string, status: ProductStatus) {
  const session = await requireAdmin();
  if (!OBJECT_ID.test(id) || !PRODUCT_STATUSES.includes(status)) {
    throw new Error("Invalid request");
  }
  await setProductStatus(id, status, session.user.id);
  refresh();
}

export async function duplicateAction(id: string) {
  const session = await requireAdmin();
  if (!OBJECT_ID.test(id)) throw new Error("Invalid request");
  const copyId = await duplicateProduct(id, session.user.id);
  refresh();
  redirect(`/admin/products/${copyId}`);
}
