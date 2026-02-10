import { client } from "../services/connectToDB.js";

export async function disconnectFromDB() {

  if (client) {
    await client.close();
    return;
  }

  return;

}
