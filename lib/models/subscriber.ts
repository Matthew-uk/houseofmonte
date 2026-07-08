import { type Collection, type ObjectId } from "mongodb";
import { getDb } from "@/lib/db";

export interface SubscriberDoc {
  _id?: ObjectId;
  email: string;
  subscribedAt: Date;
  ipAddress: string | null;
  country: string | null;
  city: string | null;
  userAgent: string | null;
  source: string;
  status: "active" | "unsubscribed";
}

export type NewSubscriber = Omit<SubscriberDoc, "_id">;

let indexesCreated = false;

export async function getSubscribersCollection(): Promise<
  Collection<SubscriberDoc>
> {
  const db = await getDb();
  const col = db.collection<SubscriberDoc>("subscribers");

  if (!indexesCreated) {
    await Promise.all([
      col.createIndex({ email: 1 }, { unique: true, background: true }),
      col.createIndex({ subscribedAt: -1 }, { background: true }),
      col.createIndex(
        { status: 1, subscribedAt: -1 },
        { background: true },
      ),
    ]);
    indexesCreated = true;
  }

  return col;
}
