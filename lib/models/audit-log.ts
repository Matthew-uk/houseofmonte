import type { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/db";

export interface AuditLogDoc {
  _id?: ObjectId;
  actorId: string; // Better Auth user id
  action: string; // e.g. "product.update", "order.ship", "user.role"
  entity: string; // collection name
  entityId: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

export async function auditLogs(): Promise<Collection<AuditLogDoc>> {
  return (await getDb()).collection<AuditLogDoc>("auditLogs");
}

export async function audit(entry: Omit<AuditLogDoc, "_id" | "createdAt">) {
  await (await auditLogs()).insertOne({ ...entry, createdAt: new Date() });
}
