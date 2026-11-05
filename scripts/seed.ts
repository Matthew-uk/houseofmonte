// Demo seed: 1 admin (ADMIN_EMAIL / ADMIN_PASSWORD), 4 collections (one a hidden
// draft) and 6 products using archive photos from public/images/seed.
// Safe to re-run: existing products and collections are left untouched, and the
// admin's password is reset to ADMIN_PASSWORD (the way to recover a lost one).
// Run: npx tsx --env-file=.env.local scripts/seed.ts
import { readFileSync } from "node:fs";
import { ObjectId } from "mongodb";
import { getClient } from "@/lib/db";
import { auth } from "@/lib/auth";
import { collections } from "@/lib/models/collection";
import { products, type ProductColor, type ImageKind } from "@/lib/models/product";
import { nairaToKobo } from "@/lib/money";

type Manifest = Record<string, { url: string; blurDataUrl: string }>;
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
    await ctx.internalAdapter.updatePassword(userId, await ctx.password.hash(password));
    console.log(`Admin exists, role ensured and password reset: ${email}`);
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

const DEMO_COLLECTIONS = [
  {
    slug: "collection-001",
    name: "COLLECTION 001",
    description: "The first MONTÈ collection.",
    status: "ACTIVE",
    cover: "hoodie-black-1",
    releaseDate: new Date("2026-07-22T00:00:00+01:00"),
  },
  {
    slug: "essentials",
    name: "ESSENTIALS",
    description: "Everyday tees, tanks and polos.",
    status: "ACTIVE",
    cover: "polo-white-1",
    releaseDate: null,
  },
  {
    slug: "denim",
    name: "DENIM",
    description: "Wide-leg denim and the pieces worn with it.",
    status: "ACTIVE",
    cover: "denim-1",
    releaseDate: null,
  },
  // Not ACTIVE, so it must stay out of the storefront.
  {
    slug: "collection-002",
    name: "COLLECTION 002",
    description: "Next drop. Draft: hidden from the shop.",
    status: "DRAFT",
    cover: null,
    releaseDate: null,
  },
] as const;

async function seedCatalogue() {
  const now = new Date();
  const cols = await collections();
  const ids: Record<string, ObjectId> = {};
  for (const [i, c] of DEMO_COLLECTIONS.entries()) {
    const doc = await cols.findOneAndUpdate(
      { slug: c.slug },
      {
        $setOnInsert: {
          name: c.name,
          description: c.description,
          status: c.status,
          sortOrder: i,
          coverImage: c.cover
            ? { url: manifest[c.cover].url, alt: `${c.name} collection` }
            : null,
          releaseDate: c.releaseDate,
          updatedAt: now,
          createdAt: now,
        },
      },
      { upsert: true, returnDocument: "after" },
    );
    ids[c.slug] = doc!._id;
    console.log(`Collection ensured: ${c.name}`);
  }

  const demo = [
    {
      name: "MONTÈ HOODIE",
      slug: "monte-hoodie",
      category: "Hoodies",
      collections: ["collection-001"],
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
      collections: ["collection-001", "essentials"],
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
      collections: ["essentials"],
      price: nairaToKobo(18000),
      description: "Fitted rib-knit tank with a small MONTÈ script on the chest.",
      details: "95% cotton, 5% elastane rib.\nMachine wash cold. Dry flat.",
      colors: [
        color("WHITE", "#f4f4f2", ["tank-white-1", "tank-white-2"], "RIBBED TANK", { S: 6, M: 6, L: 4 }, 0),
        // Fully sold out, to demo the SOLD OUT state.
        color("BLACK", "#111111", ["tank-black-1", "tank-black-2"], "RIBBED TANK", { S: 0, M: 0, L: 0 }, 1),
      ],
    },
    {
      name: "DE LUXE POLO",
      slug: "de-luxe-polo",
      category: "Polos",
      collections: ["essentials"],
      price: nairaToKobo(32000),
      description: "Piqué polo with tipped collar and the MONTÈ de Luxe crest.",
      details: "100% cotton piqué.\nMachine wash cold.",
      colors: [
        color("WHITE", "#f4f4f2", ["polo-white-1", "polo-white-2"], "DE LUXE POLO", { M: 2, L: 3, XL: 1 }, 0),
      ],
    },
    {
      name: "WIDE-LEG DENIM SHORT",
      slug: "wide-leg-denim-short",
      category: "Denim",
      collections: ["denim"],
      price: nairaToKobo(55000),
      description: "Long, wide-leg denim short with the MONTÈ crest on the leg.",
      details: "100% cotton denim.\nWash cold, inside out.",
      colors: [
        color("INDIGO", "#27406b", ["denim-1", "denim-2"], "WIDE-LEG DENIM SHORT", { S: 2, M: 5, L: 5 }, 0),
      ],
    },
    {
      // Every size out, to demo the SOLD OUT card.
      name: "SCRIPT TANK",
      slug: "script-tank",
      category: "Tops",
      collections: ["essentials"],
      price: nairaToKobo(20000),
      description: "Fitted black tank with the MONTÈ script on the chest.",
      details: "100% cotton rib.\nMachine wash cold.",
      colors: [
        color("BLACK", "#111111", ["script-tank-1", "script-tank-2"], "SCRIPT TANK", { S: 0, M: 0, L: 0 }, 0),
      ],
    },
  ];

  const prods = await products();
  for (const [i, { collections: memberOf, ...p }] of demo.entries()) {
    await prods.updateOne(
      { slug: p.slug },
      {
        $setOnInsert: {
          ...p,
          sizeGuide: "Fits true to size. Model is 185cm and wears L.",
          collectionIds: memberOf.map((slug) => ids[slug]),
          status: "ACTIVE",
          sortOrder: i,
          updatedAt: now,
          createdAt: now,
        },
      },
      { upsert: true },
    );
    console.log(`Product ensured: ${p.name}`);
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
