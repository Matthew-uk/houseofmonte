import { MongoClient, type Db } from "mongodb";

declare global {
  var _mongoClient: MongoClient | undefined;
}

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  return uri;
}

let dbPromise: Promise<Db> | null = null;

function getOrCreateClient(): MongoClient {
  const uri = getUri();

  if (process.env.NODE_ENV === "production") {
    return new MongoClient(uri, { maxPoolSize: 10 });
  }

  if (!globalThis._mongoClient) {
    globalThis._mongoClient = new MongoClient(uri, { maxPoolSize: 10 });
  }
  return globalThis._mongoClient;
}

export function getDb(): Promise<Db> {
  if (!dbPromise) {
    const client = getOrCreateClient();
    dbPromise = client.connect().then((c) => c.db());
  }
  console.log(dbPromise);
  return dbPromise;
}
