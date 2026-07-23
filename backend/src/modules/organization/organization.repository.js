import prisma from "../../config/prisma.js";

export function createOrganization(data) {
  return prisma.organization.create({ data });
}

export function listOrganizations() {
  return prisma.organization.findMany();
}

