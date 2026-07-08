import { readFileSync } from "fs";
import { resolve } from "path";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    console.error("Could not read .env.local — ensure it exists.");
    process.exit(1);
  }
}

async function main() {
  loadEnv();

  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!uri || !email || !password) {
    console.error(
      "Missing required env vars: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD",
    );
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const hash = await bcrypt.hash(password, 12);

    await db.collection("admins").updateOne(
      { email: email.toLowerCase().trim() },
      {
        $set: {
          email: email.toLowerCase().trim(),
          passwordHash: hash,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    console.log(`Admin account created/updated for ${email}`);
  } finally {
    await client.close();
  }
}

main();
