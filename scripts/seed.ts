// Demo seed: 1 admin (ADMIN_EMAIL / ADMIN_PASSWORD), 1 collection, 3 products
// × 2 colours × 3–4 sizes using archive photos from public/images/seed.
// Idempotent: upserts by slug / email.
// Run: npx tsx --env-file=.env.local scripts/seed.ts
import { readFileSync } from "node:fs";
import { ObjectId } from "mongodb";
import { getClient } from "@/lib/db";
import { auth } from "@/lib/auth";
import { collections } from "@/lib/models/collection";
import { products, type ProductColor, type ImageKind } from "@/lib/models/product";
import { nairaToKobo } from "@/lib/money";

type Manifest = Record<string, { url: string; width: number; height: number; blurDataUrl: string }>;
const manifest: Manifest = JSON.parse(
  readFileSync("public/images/seed/manifest.json", "utf-8"),
);

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");

  const ctx = await auth.$context;
  const existing = await ctx.internalAdapter.findUserByEmail(email);
  let userId = existing?.user.id;

  if (!userId) {
    const user = await ctx.internalAdapter.createUser(
      { email, name: "MONTÈ Admin", emailVerified: true, role: "ADMIN" },
      { method: "seed" },
    );
    await ctx.internalAdapter.linkAccount({
      userId: user.id,
      providerId: "credential",
      accountId: user.id,
      password: await ctx.password.hash(password),
    });
    userId = user.id;
    console.log(`Admin created: ${email}`);
  } else {
    await ctx.internalAdapter.updateUser(userId, { role: "ADMIN", emailVerified: true });
    console.log(`Admin exists, role ensured: ${email}`);
  }
}

function color(
  name: string,
  hex: string,
  imageSlugs: string[],
  productName: string,
  stock: Record<string, number>,
  sortOrder: number,
): ProductColor {
  const kinds: ImageKind[] = ["FRONT", "MODEL", "BACK", "DETAIL"];
  return {
    _id: new ObjectId(),
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    hex,
    sortOrder,
    images: imageSlugs.map((slug, i) => {
      const m = manifest[slug];
      if (!m) throw new Error(`Missing seed image ${slug} — run scripts/prepare-seed-images.mjs`);
      return {
        _id: new ObjectId(),
        url: m.url,
        publicId: `seed/${slug}`,
        width: m.width,
        height: m.height,
        blurDataUrl: m.blurDataUrl,
        alt: `${productName} in ${name.toLowerCase()} worn by model`,
        kind: kinds[i] ?? "OTHER",
        sortOrder: i,
      };
    }),
    variants: Object.entries(stock).map(([size, qty]) => ({
      _id: new ObjectId(),
      size,
      stock: qty,
      reserved: 0,
    })),
  };
}

async function seedCatalogue() {
  const now = new Date();
  const cols = await collections();
  const { _id: collectionId } = (await cols.findOneAndUpdate(
    { slug: "collection-001" },
    {
      $set: {
        name: "COLLECTION 001",
        description: "The first MONTÈ collection.",
        status: "ACTIVE",
        sortOrder: 0,
        updatedAt: now,
      },
      $setOnInsert: { coverImage: null, releaseDate: new Date("2026-07-22T00:00:00+01:00"), createdAt: now },
    },
    { upsert: true, returnDocument: "after" },
  ))!;

  const demo = [
    {
      name: "MONTÈ HOODIE",
      slug: "monte-hoodie",
      category: "Hoodies",
      price: nairaToKobo(45000),
      description: "Heavyweight brushed-fleece hoodie with the MONTÈ graphic on the front.",
      details: "100% cotton fleece, 420gsm.\nMachine wash cold, inside out. Do not tumble dry.",
      colors: [
        color("BLACK", "#111111", ["hoodie-black-1", "hoodie-black-2"], "MONTÈ HOODIE", { S: 4, M: 6, L: 2, XL: 0 }, 0),
        color("GREY MARL", "#9a9a98", ["hoodie-grey-1", "hoodie-grey-2"], "MONTÈ HOODIE", { S: 3, M: 3, L: 3 }, 1),
      ],
    },
    {
      name: "MOUNTAIN LOGO TEE",
      slug: "mountain-logo-tee",
      category: "T-Shirts",
      price: nairaToKobo(25000),
      description: "Boxy-fit tee with the MONTÈ mountain mark.",
      details: "100% cotton jersey, 240gsm.\nMachine wash cold.",
      colors: [
        color("BLACK", "#111111", ["tee-black-1", "tee-black-2"], "MOUNTAIN LOGO TEE", { S: 8, M: 10, L: 6, XL: 4 }, 0),
        color("WHITE", "#f4f4f2", ["tee-white-1", "tee-white-2"], "MOUNTAIN LOGO TEE", { S: 5, M: 2, L: 1 }, 1),
      ],
    },
    {
      name: "RIBBED TANK",
      slug: "ribbed-tank",
      category: "Tops",
      price: nairaToKobo(18000),
      description: "Fitted rib-knit tank with a small MONTÈ script on the chest.",
      details: "95% cotton, 5% elastane rib.\nMachine wash cold. Dry flat.",
      colors: [
        color("WHITE", "#f4f4f2", ["tank-white-1", "tank-white-2"], "RIBBED TANK", { S: 6, M: 6, L: 4 }, 0),
        // Fully sold out, to demo the SOLD OUT state.
        color("BLACK", "#111111", ["tank-black-1", "tank-black-2"], "RIBBED TANK", { S: 0, M: 0, L: 0 }, 1),
      ],
    },
  ];

  const prods = await products();
  for (const [i, p] of demo.entries()) {
    await prods.updateOne(
      { slug: p.slug },
      {
        $set: {
          ...p,
          sizeGuide: "Fits true to size. Model is 185cm and wears L.",
          collectionIds: [collectionId],
          status: "ACTIVE",
          sortOrder: i,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
    console.log(`Product upserted: ${p.name}`);
  }
}

async function main() {
  await seedAdmin();
  await seedCatalogue();
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(async () => (await getClient()).close());
