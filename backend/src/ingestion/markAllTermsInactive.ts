import { connectToDB } from "../db/connectToDB.js";

export async function markAllTermsInactive() {
  const db = await connectToDB();

  const termsCollection = db.collection("terms");

  await termsCollection.updateMany({}, { $set: { IsActive: false } });

  return;
}
