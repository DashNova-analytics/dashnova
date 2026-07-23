import db from "../../config/prisma.js";
import { mapDocuments } from "../../config/dbHelpers.js";

export async function createCustomer(data) {
  const now = new Date();
  const insertResult = await db.collection("Customer").insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return mapDocuments([{ _id: insertResult.insertedId, ...data, createdAt: now, updatedAt: now }])[0];
}

export async function listCustomers() {
  const customers = await db.collection("Customer").find().sort({ createdAt: -1 }).toArray();
  return mapDocuments(customers);
}

