import prisma from "../../config/prisma.js";

export function createCustomer(data) {
  return prisma.customer.create({ data });
}

export function listCustomers() {
  return prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
}

export function deleteCustomerById(id) {
  return prisma.customer.delete({ where: { id } });
}


