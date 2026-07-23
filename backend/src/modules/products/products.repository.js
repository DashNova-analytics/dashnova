import db from "../../config/prisma.js";
import { mapDocuments } from "../../config/dbHelpers.js";

export async function createProduct(data) {
  const now = new Date();
  const insertResult = await db.collection("Product").insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return mapDocuments([{ _id: insertResult.insertedId, ...data, createdAt: now, updatedAt: now }])[0];
}

export async function listProducts() {
  const products = await db.collection("Product").find().sort({ createdAt: -1 }).toArray();
  return mapDocuments(products);
}

