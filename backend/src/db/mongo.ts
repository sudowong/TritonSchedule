import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI!;
const dbName = process.env.DB_NAME!;

let client: MongoClient;
let db: Db;

export async function connectDB() {
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();

  db = client.db(dbName);
  console.log("MongoDB connected");

  return db;
}

