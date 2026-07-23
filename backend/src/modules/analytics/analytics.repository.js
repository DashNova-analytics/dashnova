import db from "../../config/prisma.js";

export async function getCounts() {
  return {
    customerCount: await db.collection("Customer").countDocuments(),
    productCount: await db.collection("Product").countDocuments(),
    uploadCount: await db.collection("Upload").countDocuments(),
  };
}

