// One-off: dump the old waitlist `subscribers` collection to CSV before the
// waitlist code is removed. Run: npx tsx --env-file=.env.local scripts/export-subscribers.ts
import { writeFileSync } from "fs";
import { MongoClient } from "mongodb";

const csv = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const docs = await client
      .db()
      .collection("subscribers")
      .find({}, { sort: { subscribedAt: 1 } })
      .toArray();
    const cols = ["email", "subscribedAt", "status", "source", "country", "city"];
    const lines = [
      cols.join(","),
      ...docs.map((d) =>
        cols
          .map((c) => csv(d[c] instanceof Date ? d[c].toISOString() : d[c]))
          .join(","),
      ),
    ];
    const out = `exports/subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    writeFileSync(out, lines.join("\n") + "\n");
    console.log(`Exported ${docs.length} subscribers to ${out}`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
