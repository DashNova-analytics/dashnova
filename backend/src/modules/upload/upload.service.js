import { createUpload as createUploadRepo, listUploads } from "./upload.repository.js";
import prisma from "../../config/prisma.js";

export function createUpload(data) {
  return createUploadRepo(data);
}

export function getUploads() {
  return listUploads();
}

export async function syncParsedDataToDatabase(payload) {
  const { products = [], customers = [], sales = [], organizationId, organizationName } = payload || {};

  let organization = null;
  if (organizationId) {
    organization = await prisma.organization.findUnique({ where: { id: organizationId } });
  }

  if (!organization && organizationName) {
    organization = await prisma.organization.upsert({
      where: { name: organizationName },
      update: {},
      create: { name: organizationName },
    });
  }

  if (!organization) {
    organization = await prisma.organization.upsert({
      where: { name: "Default Organization" },
      update: {},
      create: { name: "Default Organization" },
    });
  }

  // 1. Persist products to Neon DB
  if (Array.isArray(products) && products.length > 0) {
    for (const p of products) {
      if (!p.name) continue;
      const price = typeof p.price === 'number' ? p.price : (parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0);
      const stock = typeof p.stock === 'number' ? p.stock : (parseInt(p.stock, 10) || 50);
      const soldCount = typeof p.soldCount === 'number' ? p.soldCount : (parseInt(p.soldCount, 10) || 0);
      
      const existing = await prisma.product.findFirst({
        where: { name: p.name, organizationId: organization.id }
      });
      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: { price, stock, soldCount, category: p.category || existing.category }
        });
      } else {
        await prisma.product.create({
          data: {
            sku: p.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
            name: p.name,
            category: p.category || 'General',
            price,
            stock,
            soldCount,
            organizationId: organization.id
          }
        });
      }
    }
  }

  // 2. Persist customers to Neon DB
  if (Array.isArray(customers) && customers.length > 0) {
    for (const c of customers) {
      if (!c.name) continue;
      const email = c.email && c.email !== '—' ? c.email : `${c.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@company.io`;
      const salesVal = typeof c.sales === 'number' ? c.sales : (parseFloat(String(c.sales).replace(/[^0-9.]/g, '')) || 0);
      const ordersVal = typeof c.orders === 'number' ? c.orders : (parseInt(c.orders, 10) || 1);

      await prisma.customer.upsert({
        where: { email },
        update: {
          name: c.name,
          region: c.region || 'North America',
          sales: salesVal,
          orders: ordersVal
        },
        create: {
          name: c.name,
          email,
          region: c.region || 'North America',
          sales: salesVal,
          orders: ordersVal,
          organizationId: organization.id
        }
      });
    }
  }

  return { success: true, countProducts: products.length, countCustomers: customers.length };
}


