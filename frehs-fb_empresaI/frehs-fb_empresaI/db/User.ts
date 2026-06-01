import { MongoClient } from "mongodb";

export type UserDB = {
  name: string;
  password: string;
  favorite?: string;
};

const getUsersCollection = async () => {
  const url = Deno.env.get("MONGO_URL");
  if (!url) {
    throw new Error("MONGO_URL is not set");
  }

  const client = new MongoClient(url);
  await client.connect();
  const db = client.db("usersDBBot");
  return db.collection<UserDB>("users");
};

export default getUsersCollection;
