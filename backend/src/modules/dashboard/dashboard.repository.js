import prisma from "../../config/prisma.js";

export async function getSummary() {
  const [users, organizations, products, customers, uploads] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.product.count(),
    prisma.customer.count(),
    prisma.upload.count(),
  ]);
  return { users, organizations, products, customers, uploads };
}

