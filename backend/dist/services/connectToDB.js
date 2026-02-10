import { MongoClient, Db } from "mongodb";
export let client = null;
let db = null;
let connecting = null;
export async function connectToDB() {
    if (db)
        return db;
    const dbName = process.env.DB_NAME;
    const uri = process.env.MONGO_URI || "";
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    return db;
}
