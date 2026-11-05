// Creates every MongoDB index the app relies on. Idempotent; run after deploys
// that add collections: npx tsx --env-file=.env.local scripts/indexes.ts
import { getClient } from "@/lib/db";
import { collections } from "@/lib/models/collection";
import { products } from "@/lib/models/product";
import { stockMovements } from "@/lib/models/stock-movement";
import { auditLogs } from "@/lib/models/audit-log";

async function main() {
  const [col, prod, moves, audit] = await Promise.all([
    collections(),
    products(),
    stockMovements(),
    auditLogs(),
  ]);

  await Promise.all([
    col.createIndex({ slug: 1 }, { unique: true }),
    col.createIndex({ status: 1, sortOrder: 1 }),

    prod.createIndex({ slug: 1 }, { unique: true }),
    prod.createIndex({ status: 1, sortOrder: 1, createdAt: -1 }),
    prod.createIndex({ collectionIds: 1, status: 1 }),
    prod.createIndex({ "colors.variants._id": 1 }),
    prod.createIndex(
      { "colors.variants.sku": 1 },
      {
        unique: true,
        partialFilterExpression: { "colors.variants.sku": { $type: "string" } },
      },
    ),

    moves.createIndex({ variantId: 1, createdAt: -1 }),
    moves.createIndex({ createdAt: -1 }),

    audit.createIndex({ entity: 1, entityId: 1, createdAt: -1 }),
    audit.createIndex({ createdAt: -1 }),
  ]);

  console.log("Indexes ensured.");
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(async () => (await getClient()).close());
