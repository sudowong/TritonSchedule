import { connectToDB } from "../db/connectToDB.js";
import { Db } from "mongodb";
import { disconnectFromDB } from "../db/disconnectFromDB.js";
import { insertDB } from "../services/insertDB.js";
import puppeteer from "puppeteer";

// TODO:
// - Once i scrape all the contents from the website
// i go through the objects in the mongo database and query the
// teacher names with the API, and then input that information in the
// document folder, and add each teacher to a set to track that it was
// search for

// FIXME: You'll use this independently of the webreg script

let searched = new Set<string>();

export async function rmpUpdate() {
  const db: Db = await connectToDB();
  let docs = await db.collection("courses").find({}).toArray();

  for (const doc of docs) {
    const cleanTeacher = doc.Teacher.replace(/\s+/g, " ")
      .replace(/[^\w\s]/g, "")
      .trim();

    if (cleanTeacher.length > 0 && !searched.has(cleanTeacher)) {
      searched.add(cleanTeacher);
    }
  }

  await disconnectFromDB();

  return;
}

await rmpUpdate();
