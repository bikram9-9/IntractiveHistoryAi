import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

const clientPromise =
  global._mongoClientPromise ||
  (global._mongoClientPromise = new MongoClient(uri, options).connect());

if (process.env.NODE_ENV !== "production")
  global._mongoClientPromise = clientPromise;

export default clientPromise;

export async function testConnection() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const dbs = await db.admin().listDatabases();
    console.log(
      "Connected successfully. Available databases:",
      dbs.databases.map((db) => db.name)
    );
    return true;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return false;
  }
}
