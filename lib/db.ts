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

  // Cached on globalThis in every environment: dev survives HMR, and prod
  // must hand the same connected client to getDb() and getClient().
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
  return dbPromise;
}

// The connected client, for multi-document transactions
// (`client.startSession()` + `session.withTransaction`).
export async function getClient(): Promise<MongoClient> {
  await getDb();
  return getOrCreateClient();
}
