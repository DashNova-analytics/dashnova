import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { name: "Default Organization" },
    update: {},
    create: { name: "Default Organization" },
  });

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: bcrypt.hashSync("password123", 10),
      organizationId: organization.id,
    },
  });

  const existingProduct = await prisma.product.findFirst({
    where: { name: "Sample Product", organizationId: organization.id },
  });
  if (!existingProduct) {
    await prisma.product.create({
      data: { name: "Sample Product", description: "Seed product", price: 29.99, organizationId: organization.id },
    });
  }

  await prisma.customer.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: { name: "Sample Customer", email: "customer@example.com", phone: "+1234567890", organizationId: organization.id },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

