import { app } from "./api/app.js";
import { connectDB } from "./db/mongo.js";
import { searchClass } from "./utils/searchClass.js";
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
async function main() {
    const db = await connectDB();
    const courses = db.collection("courses");
    const classes = await searchClass("cse11", "WI26");
    await courses.insertMany(classes);
    console.log("Item inserted");
}
main();
