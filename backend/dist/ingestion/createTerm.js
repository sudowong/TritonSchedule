import { connectToDB } from "../services/connectToDB.js";
export async function createTerm(newTerm) {
    const db = await connectToDB();
    const terms = db.collection("terms");
    const exists = await terms.find({ Term: newTerm }).toArray();
    if (exists.length <= 0) {
        const newInsertTerm = {
            Term: newTerm,
            IsActive: true,
        };
        await terms.insertOne(newInsertTerm);
    }
    return;
}
