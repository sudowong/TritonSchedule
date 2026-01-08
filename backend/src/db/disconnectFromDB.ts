import { client } from "./connectToDB.js";

export async function disconnectFromDB() {
  await client.close();
  console.log("Closed connection to DB");
}
