import prisma from "../../config/prisma.js";

export function createProduct(data) {
  return prisma.product.create({ data });
}

export function listProducts() {
  return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
}

export function deleteProductById(id) {
  return prisma.product.delete({ where: { id } });
}


