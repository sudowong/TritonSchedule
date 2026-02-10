import { ingest } from "../ingestion/ingest.js";
import { connectToDB } from "../services/connectToDB.js";
import type { Db } from "mongodb";

export async function updateInformation(req: any, res: any) {

  const db: Db = await connectToDB();

  const courseCollection = db.collection("courses");
  const rmpCollection = db.collection("rmpData");

  await courseCollection.deleteMany({}); // Delete all existing courses for updates
  await rmpCollection.deleteMany({}); // Delete all existing rmp data for updates

  await ingest(); // Updates 

  return res.status(200).send({ message: "Courses updated" });

}
