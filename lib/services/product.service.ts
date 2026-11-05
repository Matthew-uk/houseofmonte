import "server-only";
import { MongoServerError, ObjectId, type ClientSession } from "mongodb";
import { getClient } from "@/lib/db";
import { auditLogs } from "@/lib/models/audit-log";
import { collections } from "@/lib/models/collection";
import {
  available,
  colorPrice,
  DEFAULT_LOW_STOCK_THRESHOLD,
  products,
  type ProductColor,
  type ProductDoc,
  type ProductStatus,
  type Variant,
} from "@/lib/models/product";
import { stockMovements, type StockMovementDoc } from "@/lib/models/stock-movement";
import { assertKobo, nairaToKobo } from "@/lib/money";
import { slugify } from "@/lib/slug";
import type { ProductInput } from "@/lib/validation/catalog";

export class ProductError extends Error {}

// ---------- Storefront reads ----------

export interface ProductTile {
  id: string;
  name: string;
  slug: string;
  price: number; // kobo
  soldOut: boolean;
  image: { url: string; alt: string; blurDataUrl?: string } | null;
  hoverImage: { url: string; alt: string } | null;
  colors: { name: string; hex?: string }[];
}

function colorInStock(c: ProductColor): boolean {
  return c.variants.some((v) => available(v) > 0);
}

function toTile(p: ProductDoc): ProductTile {
  // Lead with a colour that can actually be bought.
  const color = p.colors.find(colorInStock) ?? p.colors[0];
  const [first, second] = color?.images ?? [];
  return {
    id: p._id.toHexString(),
    name: p.name,
    slug: p.slug,
    price: color ? colorPrice(p, color) : p.price,
    soldOut: !p.colors.some(colorInStock),
    image: first ? { url: first.url, alt: first.alt, blurDataUrl: first.blurDataUrl } : null,
    hoverImage: second ? { url: second.url, alt: second.alt } : null,
    colors: p.colors.map((c) => ({ name: c.name, hex: c.hex })),
  };
}

const STORE_SORT = { sortOrder: 1, createdAt: -1 } as const;

export async function listStoreProducts(collectionId?: ObjectId): Promise<ProductTile[]> {
  const docs = await (await products())
    .find({ status: "ACTIVE", ...(collectionId && { collectionIds: collectionId }) })
    .sort(STORE_SORT)
    .limit(200)
    .toArray();
  return docs.map(toTile);
}

export async function getStoreProduct(slug: string): Promise<ProductDoc | null> {
  return (await products()).findOne({ slug, status: "ACTIVE" });
}

export async function listStoreProductSlugs() {
  return (await products())
    .find({ status: "ACTIVE" }, { projection: { slug: 1, updatedAt: 1 } })
    .toArray();
}

// ---------- Admin reads ----------

export async function listAdminProducts(): Promise<ProductDoc[]> {
  return (await products()).find({}).sort(STORE_SORT).toArray();
}

export async function getProductById(id: string): Promise<ProductDoc | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  return (await products()).findOne({ _id: new ObjectId(id) });
}

export interface LowStockRow {
  productId: string;
  name: string;
  color: string;
  size: string;
  available: number;
}

export async function listLowStock(): Promise<LowStockRow[]> {
  const docs = await (await products()).find({ status: "ACTIVE" }).toArray();
  const rows: LowStockRow[] = [];
  for (const p of docs) {
    for (const c of p.colors) {
      for (const v of c.variants) {
        const left = available(v);
        if (left <= (v.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD)) {
          rows.push({
            productId: p._id.toHexString(),
            name: p.name,
            color: c.name,
            size: v.size,
            available: left,
          });
        }
      }
    }
  }
  return rows.sort((a, b) => a.available - b.available);
}

// ---------- Admin writes ----------

function reuseId(id: string | undefined, known: Set<string>): ObjectId {
  // Only ids already on this product are reused; anything else gets a new id,
  // so a crafted payload can't collide with another product's variant.
  return id && known.has(id) ? new ObjectId(id) : new ObjectId();
}

function currentVariants(existing: ProductDoc | null): Map<string, { variant: Variant; colorId: ObjectId }> {
  const map = new Map<string, { variant: Variant; colorId: ObjectId }>();
  for (const c of existing?.colors ?? []) {
    for (const v of c.variants) map.set(v._id.toHexString(), { variant: v, colorId: c._id });
  }
  return map;
}

function buildColors(input: ProductInput, existing: ProductDoc | null): ProductColor[] {
  const colorIds = new Set(existing?.colors.map((c) => c._id.toHexString()));
  const imageIds = new Set(
    existing?.colors.flatMap((c) => c.images.map((i) => i._id.toHexString())),
  );
  const variants = currentVariants(existing);
  const variantIds = new Set(variants.keys());

  return input.colors.map((c, colorIndex) => ({
    _id: reuseId(c.id, colorIds),
    name: c.name.toUpperCase(),
    slug: slugify(c.name),
    ...(c.hex && { hex: c.hex.toLowerCase() }),
    ...(c.priceOverrideNaira !== undefined && {
      priceOverride: nairaToKobo(c.priceOverrideNaira),
    }),
    sortOrder: colorIndex,
    images: c.images.map((img, i) => ({
      _id: reuseId(img.id, imageIds),
      url: img.url,
      kind: img.kind,
      alt: img.alt || `${input.name} worn by model`,
      sortOrder: i,
    })),
    variants: c.variants.map((v) => {
      const _id = reuseId(v.id, variantIds);
      return {
        _id,
        size: v.size.toUpperCase(),
        ...(v.sku && { sku: v.sku }),
        stock: v.stock,
        // Reservations belong to checkouts, never to the form.
        reserved: variants.get(_id.toHexString())?.variant.reserved ?? 0,
        ...(v.lowStockThreshold !== undefined && { lowStockThreshold: v.lowStockThreshold }),
      };
    }),
  }));
}

function stockChanges(
  productId: ObjectId,
  existing: ProductDoc | null,
  colors: ProductColor[],
  actorId: string,
  now: Date,
): StockMovementDoc[] {
  const before = currentVariants(existing);
  const moves: StockMovementDoc[] = [];
  const kept = new Set<string>();

  for (const c of colors) {
    for (const v of c.variants) {
      const key = v._id.toHexString();
      kept.add(key);
      const prior = before.get(key)?.variant;
      if (prior && v.stock < prior.reserved) {
        throw new ProductError(
          `${c.name} / ${v.size}: stock can't go below the ${prior.reserved} reserved.`,
        );
      }
      const delta = v.stock - (prior?.stock ?? 0);
      if (delta !== 0) {
        moves.push({
          productId,
          colorId: c._id,
          variantId: v._id,
          delta,
          reason: prior ? "ADMIN_ADJUST" : "INITIAL",
          actorId,
          createdAt: now,
        });
      }
    }
  }

  for (const [key, { variant, colorId }] of before) {
    if (kept.has(key)) continue;
    if (variant.reserved > 0) {
      throw new ProductError(`Size ${variant.size} has reserved stock and can't be removed.`);
    }
    if (variant.stock !== 0) {
      moves.push({
        productId,
        colorId,
        variantId: variant._id,
        delta: -variant.stock,
        reason: "ADMIN_ADJUST",
        note: "Size removed",
        actorId,
        createdAt: now,
      });
    }
  }
  return moves;
}

function duplicateKeyMessage(err: MongoServerError): string {
  return JSON.stringify(err.keyPattern ?? {}).includes("sku")
    ? "That SKU is already used by another product."
    : "That slug is already used by another product.";
}

/** Creates (id undefined) or updates a product, logging stock changes atomically. */
export async function saveProduct(
  input: ProductInput,
  actorId: string,
  id?: string,
): Promise<string> {
  const col = await products();
  const moves = await stockMovements();
  const audits = await auditLogs();
  const client = await getClient();
  const session: ClientSession = client.startSession();
  const now = new Date();

  try {
    return await session.withTransaction(async () => {
      const existing = id
        ? await col.findOne({ _id: new ObjectId(id) }, { session })
        : null;
      if (id && !existing) throw new ProductError("This product no longer exists.");

      const _id = existing?._id ?? new ObjectId();
      const colors = buildColors(input, existing);
      const changes = stockChanges(_id, existing, colors, actorId, now);

      const fields = {
        name: input.name,
        slug: input.slug,
        description: input.description,
        details: input.details,
        sizeGuide: input.sizeGuide,
        category: input.category,
        price: assertKobo(nairaToKobo(input.priceNaira)),
        collectionIds: input.collectionIds.map((c) => new ObjectId(c)),
        status: input.status,
        sortOrder: input.sortOrder,
        colors,
        updatedAt: now,
      };

      if (existing) {
        await col.updateOne(
          { _id },
          {
            $set: {
              ...fields,
              ...(input.compareAtNaira !== undefined && {
                compareAtPrice: nairaToKobo(input.compareAtNaira),
              }),
            },
            ...(input.compareAtNaira === undefined && { $unset: { compareAtPrice: "" } }),
          },
          { session },
        );
      } else {
        await col.insertOne(
          {
            _id,
            ...fields,
            ...(input.compareAtNaira !== undefined && {
              compareAtPrice: nairaToKobo(input.compareAtNaira),
            }),
            createdAt: now,
          },
          { session },
        );
      }

      if (changes.length > 0) await moves.insertMany(changes, { session });
      await audits.insertOne(
        {
          actorId,
          action: existing ? "product.update" : "product.create",
          entity: "products",
          entityId: _id.toHexString(),
          meta: { stockChanges: changes.length },
          createdAt: now,
        },
        { session },
      );
      return _id.toHexString();
    });
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new ProductError(duplicateKeyMessage(err));
    }
    throw err;
  } finally {
    await session.endSession();
  }
}

export async function setProductStatus(id: string, status: ProductStatus, actorId: string) {
  const res = await (await products()).updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } },
  );
  if (res.matchedCount === 0) throw new ProductError("This product no longer exists.");
  await (await auditLogs()).insertOne({
    actorId,
    action: "product.status",
    entity: "products",
    entityId: id,
    meta: { status },
    createdAt: new Date(),
  });
}

/** Copies a product as a DRAFT with zero stock and no SKUs, to speed up colourways. */
export async function duplicateProduct(id: string, actorId: string): Promise<string> {
  const source = await getProductById(id);
  if (!source) throw new ProductError("This product no longer exists.");

  const col = await products();
  let slug = `${source.slug}-copy`;
  for (let n = 2; await col.findOne({ slug }, { projection: { _id: 1 } }); n++) {
    slug = `${source.slug}-copy-${n}`;
  }

  const now = new Date();
  const _id = new ObjectId();
  await col.insertOne({
    ...source,
    _id,
    name: `${source.name} COPY`,
    slug,
    status: "DRAFT",
    colors: source.colors.map((c) => ({
      ...c,
      _id: new ObjectId(),
      images: c.images.map((i) => ({ ...i, _id: new ObjectId() })),
      variants: c.variants.map(({ sku: _sku, ...v }) => ({
        ...v,
        _id: new ObjectId(),
        stock: 0,
        reserved: 0,
      })),
    })),
    createdAt: now,
    updatedAt: now,
  });
  await (await auditLogs()).insertOne({
    actorId,
    action: "product.duplicate",
    entity: "products",
    entityId: _id.toHexString(),
    meta: { sourceId: id },
    createdAt: now,
  });
  return _id.toHexString();
}

export async function activeCollectionBySlug(slug: string) {
  return (await collections()).findOne({ slug, status: "ACTIVE" });
}
