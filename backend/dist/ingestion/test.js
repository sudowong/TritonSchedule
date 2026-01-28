import { Db } from "mongodb";
import { connectToDB } from "../db/connectToDB.js";
import { disconnectFromDB } from "../db/disconnectFromDB.js";
let db = await connectToDB();
let testString = "Treuer, John N";
async function test() {
    testString = testString
        .replace(/[\p{P}\p{S}]/gu, "")
        .split(" ")
        .slice(0, 2)
        .reverse()
        .join(" ")
        .toLowerCase();
    const results = await db
        .collection("rmpData")
        .find({
        name: {
            $regex: testString, // The string pattern without delimiters
            $options: "i", // Options as a string (e.g., 'i' for case-insensitive)
        },
    })
        .toArray();
    if (results.length > 0) {
        console.log("exists");
    }
    else {
        console.log("does not exist");
    }
    await disconnectFromDB();
    return;
}
// function normalizeTest() {
//   // testString = testString.split(" ");
//
//   testString = testString
//     .replace(/[\p{P}\p{S}]/gu, "")
//     .split(" ")
//     .slice(0, 2)
//     .reverse()
//     .join(" ")
//     .toLowerCase();
//   console.log(testString);
//   return;
// }
// normalizeTest();
test();
