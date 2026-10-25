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

// One client per process, cached on globalThis in every environment: dev
// survives HMR, and prod shares the pool between the app and Better Auth.
// The driver connects lazily on the first operation.
export function getMongoClient(): MongoClient {
  if (!globalThis._mongoClient) {
    globalThis._mongoClient = new MongoClient(getUri(), { maxPoolSize: 10 });
  }
  return globalThis._mongoClient;
}

let dbPromise: Promise<Db> | null = null;

export function getDb(): Promise<Db> {
  if (!dbPromise) {
    dbPromise = getMongoClient()
      .connect()
      .then((c) => c.db());
  }
  return dbPromise;
}

// The connected client, for multi-document transactions
// (`client.startSession()` + `session.withTransaction`).
export async function getClient(): Promise<MongoClient> {
  await getDb();
  return getMongoClient();
}
