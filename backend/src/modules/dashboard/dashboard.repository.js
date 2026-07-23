import db from "../../config/prisma.js";

export async function getSummary() {
  const [users, organizations, products, customers, uploads] = await Promise.all([
    db.collection("User").countDocuments(),
    db.collection("Organization").countDocuments(),
    db.collection("Product").countDocuments(),
    db.collection("Customer").countDocuments(),
    db.collection("Upload").countDocuments(),
  ]);
  return { users, organizations, products, customers, uploads };
}

