import bcrypt from "bcryptjs";
import db from "../src/config/prisma.js";

async function main() {
  const now = new Date();
  const organizations = db.collection("Organization");
  const users = db.collection("User");
  const products = db.collection("Product");
  const customers = db.collection("Customer");

  const organization = await organizations.findOneAndUpdate(
    { name: "Default Organization" },
    {
      $setOnInsert: {
        name: "Default Organization",
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  const adminEmail = "admin@example.com";
  await users.updateOne(
    { email: adminEmail },
    {
      $setOnInsert: {
        email: adminEmail,
        name: "Admin User",
        password: bcrypt.hashSync("password123", 10),
        organizationId: organization.value._id.toString(),
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true }
  );

  const sampleProduct = await products.findOne({ name: "Sample Product", organizationId: organization.value._id.toString() });
  if (!sampleProduct) {
    await products.insertOne({
      name: "Sample Product",
      description: "Seed product",
      price: 29.99,
      organizationId: organization.value._id.toString(),
      createdAt: now,
      updatedAt: now,
    });
  }

  await customers.updateOne(
    { email: "customer@example.com" },
    {
      $setOnInsert: {
        name: "Sample Customer",
        email: "customer@example.com",
        phone: "+1234567890",
        organizationId: organization.value._id.toString(),
        createdAt: now,
        updatedAt: now,
      },
    },
    { upsert: true }
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit(0));

