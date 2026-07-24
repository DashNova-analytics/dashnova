import { createProduct, listProducts, deleteProductById } from "./products.repository.js";
import prisma from "../../config/prisma.js";

async function getDefaultOrgId() {
  const defaultOrg = await prisma.organization.upsert({
    where: { name: "Default Organization" },
    update: {},
    create: { name: "Default Organization" },
  });
  return defaultOrg.id;
}

export async function createProductService(data) {
  let orgId = data.organizationId;
  if (!orgId) {
    orgId = await getDefaultOrgId();
  }

  const sku = data.sku || `SKU-P${Math.floor(1000 + Math.random() * 9000)}`;
  const price = typeof data.price === 'number' ? data.price : parseFloat(data.price) || 0;
  const stock = typeof data.stock === 'number' ? data.stock : parseInt(data.stock, 10) || 50;
  const soldCount = typeof data.soldCount === 'number' ? data.soldCount : parseInt(data.soldCount, 10) || 0;

  return createProduct({
    name: data.name,
    sku,
    category: data.category || 'General',
    description: data.description || '',
    price,
    stock,
    soldCount,
    organizationId: orgId,
  });
}

export async function getProducts() {
  return listProducts();
}

export async function removeProduct(id) {
  return deleteProductById(id);
}


