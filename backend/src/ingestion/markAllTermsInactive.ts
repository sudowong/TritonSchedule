import { connectToDB } from "../db/connectToDB.js";
import { disconnectFromDB } from "../db/disconnectFromDB.js";

async function markAllTermsInactive() {
  const db = await connectToDB();

  const termsCollection = db.collection("terms");

  await termsCollection.updateMany({}, { $set: { IsActive: false } });

  console.log("Marked all terms inactive");

  await disconnectFromDB();

  return;
}

markAllTermsInactive();
