// Crops MONTÈ archive photos to 4:5 web JPEGs for the demo seed and writes a
// manifest with dimensions + blur placeholders that scripts/seed.ts reads.
// Run: node scripts/prepare-seed-images.mjs
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SRC = "assets/archive";
const OUT = "public/images/seed";
const W = 1200;
const H = 1500;

// slug -> source file (relative to SRC). Position biases the 4:5 crop.
const IMAGES = {
  "hoodie-black-1": ["collection001(2).JPG", "centre"],
  "hoodie-black-2": ["collection001(1).PNG", "centre"],
  "hoodie-grey-1": ["collection001(3).PNG", "centre"],
  "hoodie-grey-2": ["instagram1.png", "centre"],
  "tee-black-1": ["collection001(2).PNG", "centre"],
  "tee-black-2": ["instagram6.png", "north"],
  "tee-white-1": ["instagram10.png", "centre"],
  "tee-white-2": ["instagram9.JPG", "centre"],
  "tank-white-1": ["instagram3.png", "centre"],
  "tank-white-2": ["instagram4.png", "centre"],
  "tank-black-1": ["instagram7.PNG", "centre"],
  "tank-black-2": ["img1.JPG", "north"],
  "polo-white-1": ["instagram11.JPG", "centre"],
  "polo-white-2": ["instagram1.png", "centre"],
  "script-tank-1": ["instagram7.PNG", "centre"],
  "script-tank-2": ["img2.JPG", "centre"],
  "denim-1": ["instagram8.JPG", "centre"],
  "denim-2": ["instagram10.png", "centre"],
};

await mkdir(OUT, { recursive: true });
const manifest = {};

for (const [slug, [file, position]] of Object.entries(IMAGES)) {
  const base = sharp(`${SRC}/${file}`).rotate().resize(W, H, { fit: "cover", position });
  await base.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`${OUT}/${slug}.jpg`);
  const blur = await base.clone().resize(10, 13).jpeg({ quality: 50 }).toBuffer();
  manifest[slug] = {
    url: `/images/seed/${slug}.jpg`,
    width: W,
    height: H,
    blurDataUrl: `data:image/jpeg;base64,${blur.toString("base64")}`,
  };
  console.log(`${slug} <- ${file}`);
}

await writeFile(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2) + "\n");
