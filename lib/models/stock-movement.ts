import type { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/db";

export const STOCK_REASONS = [
  "ADMIN_ADJUST", // manual edit in admin
  "INITIAL", // stock set when a size is created
  "SALE", // paid order converted reservation into decrement
  "RETURN",
  "CORRECTION",
] as const;
export type StockReason = (typeof STOCK_REASONS)[number];

export interface StockMovementDoc {
  _id?: ObjectId;
  productId: ObjectId;
  colorId: ObjectId;
  variantId: ObjectId;
  delta: number; // signed change to `stock`
  reason: StockReason;
  note?: string;
  orderId?: ObjectId;
  actorId?: string; // Better Auth user id; absent for system changes
  createdAt: Date;
}

export async function stockMovements(): Promise<Collection<StockMovementDoc>> {
  return (await getDb()).collection<StockMovementDoc>("stockMovements");
}
