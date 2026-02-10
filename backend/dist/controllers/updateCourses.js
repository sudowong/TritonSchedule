import { ingest } from "../ingestion/ingest.js";
import { connectToDB } from "../services/connectToDB.js";
export async function updateInformation(req, res) {
    const db = await connectToDB();
    const courseCollection = db.collection("courses");
    await courseCollection.deleteMany({}); // Delete all existing courses for updates
    await ingest(); // Updates 
    return res.status(200).send({ message: "Courses updated" });
}
