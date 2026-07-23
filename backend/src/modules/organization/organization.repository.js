import db from "../../config/prisma.js";
import { mapDocuments } from "../../config/dbHelpers.js";

export async function createOrganization(data) {
  const now = new Date();
  const insertResult = await db.collection("Organization").insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return mapDocuments([{ _id: insertResult.insertedId, ...data, createdAt: now, updatedAt: now }])[0];
}

export async function listOrganizations() {
  const organizations = await db.collection("Organization").find().toArray();
  return mapDocuments(organizations);
}

