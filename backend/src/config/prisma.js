import { MongoClient } from "mongodb";
import { MONGODB_URI } from "./env.js";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db();

export default db;
export { client };

