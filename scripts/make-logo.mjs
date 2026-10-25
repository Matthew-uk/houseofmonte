// Derives the header logo from the brand asset: the source is white line art
// on a padded transparent square, invisible on the off-white theme. This keeps
// the alpha channel, paints every pixel near-black and trims the padding.
// Run: node scripts/make-logo.mjs
import sharp from "sharp";

const src = "public/images/logo.PNG";
const out = "public/images/logo-black.png";

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  data[i] = data[i + 1] = data[i + 2] = 10; // #0A0A0A
}

await sharp(data, { raw: info })
  .trim({ threshold: 1 })
  .png({ compressionLevel: 9 })
  .toFile(out);

const meta = await sharp(out).metadata();
console.log(`${out}: ${meta.width}x${meta.height}`);
