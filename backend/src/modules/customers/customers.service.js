import { createCustomer, listCustomers, deleteCustomerById } from "./customers.repository.js";
import prisma from "../../config/prisma.js";

async function getDefaultOrgId() {
  const defaultOrg = await prisma.organization.upsert({
    where: { name: "Default Organization" },
    update: {},
    create: { name: "Default Organization" },
  });
  return defaultOrg.id;
}

export async function createCustomerService(data) {
  let orgId = data.organizationId;
  if (!orgId) {
    orgId = await getDefaultOrgId();
  }

  const sales = typeof data.sales === 'number' ? data.sales : parseFloat(data.sales) || 0;
  const orders = typeof data.orders === 'number' ? data.orders : parseInt(data.orders, 10) || 1;

  return createCustomer({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    region: data.region || 'North America',
    sales,
    orders,
    status: data.status || 'Active',
    organizationId: orgId,
  });
}

export async function getCustomers() {
  return listCustomers();
}

export async function removeCustomer(id) {
  return deleteCustomerById(id);
}


