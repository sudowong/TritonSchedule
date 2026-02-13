import { MongoClient, Db } from "mongodb";

export let client: MongoClient | null = null;
let db: Db | null = null;
let connecting: Promise<Db> | null = null;

export async function connectToDB() {
  if (db) return db;

  if (connecting) return connecting;

  const dbName = process.env.DB_NAME!;
  const uri = process.env.MONGO_URI || "";

  connecting = (async () => {
    if (!client) {
      client = new MongoClient(uri);
    }

    await client.connect();
    db = client.db(dbName);
    return db;
  })();

  try {
    return await connecting;
  } finally {
    connecting = null;
  }
}
