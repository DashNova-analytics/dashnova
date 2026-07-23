import prisma from "../../config/prisma.js";

export async function getCounts() {
  return {
    customerCount: await prisma.customer.count(),
    productCount: await prisma.product.count(),
    uploadCount: await prisma.upload.count(),
  };
}

