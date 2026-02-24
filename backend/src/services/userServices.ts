import type { WithId } from "mongodb";
import { connectToDB } from "./connectToDB.js";
import bcrypt from "bcryptjs";

type User = {
  name: string;
  password: string;
};

function getUsersCollectionName() {
  return "users";
}

export async function register(user: User) {

  const db = await connectToDB();
  const usersCollection = db.collection<User>(getUsersCollectionName());

  try {
    const existing = await usersCollection.findOne({ name: user.name });

    const hash = bcrypt.hashSync(user.password, 10);

    if (existing) {
      throw new Error("User already exists");
    }

    await usersCollection.insertOne({
      name: user.name,
      password: hash,
    });
  } catch (error) {
    throw error;
  }

}

export async function login(user: User): Promise<WithId<User> | null> {

  const db = await connectToDB();
  const usersCollection = db.collection<User>(getUsersCollectionName());

  const validName = await usersCollection.findOne({ name: user.name, });

  if (!validName) {
    throw new Error("Incorrect username");
  }

  const validPassword = await bcrypt.compare(user.password, validName.password);

  if (!validPassword) {
    throw new Error("Incorrect password");
  }

  try {
    const foundUser = await usersCollection.findOne({
      name: user.name,
    });
    return foundUser;
  } catch (error) {
    throw error;
  }

}

