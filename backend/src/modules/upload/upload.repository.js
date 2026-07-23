import db from "../../config/prisma.js";
import { mapDocuments } from "../../config/dbHelpers.js";

export async function createUpload(data) {
  const now = new Date();
  const insertResult = await db.collection("Upload").insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return mapDocuments([{ _id: insertResult.insertedId, ...data, createdAt: now, updatedAt: now }])[0];
}

export async function listUploads() {
  const uploads = await db.collection("Upload").find().sort({ createdAt: -1 }).toArray();
  return mapDocuments(uploads);
}

