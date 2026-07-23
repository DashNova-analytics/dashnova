import db from "../../config/prisma.js";
import { toObjectId, mapDocument } from "../../config/dbHelpers.js";

export async function getUserByEmail(email) {
  return mapDocument(await db.collection("User").findOne({ email }));
}

export async function getUserByClerkId(clerkUserId) {
  return mapDocument(await db.collection("User").findOne({ clerkUserId }));
}

export async function createUser(data) {
  const now = new Date();
  const insertResult = await db.collection("User").insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return mapDocument({ _id: insertResult.insertedId, ...data, createdAt: now, updatedAt: now });
}

export async function updateUser(id, data) {
  const updatedAt = new Date();
  await db.collection("User").updateOne({ _id: toObjectId(id) }, { $set: { ...data, updatedAt } });
  return mapDocument(await db.collection("User").findOne({ _id: toObjectId(id) }));
}

