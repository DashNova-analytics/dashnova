import prisma from "../../config/prisma.js";

export function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export function getUserByClerkId(clerkUserId) {
  return prisma.user.findUnique({ where: { clerkUserId } });
}

export function createUser(data) {
  return prisma.user.create({ data });
}

export function updateUser(id, data) {
  return prisma.user.update({ where: { id }, data });
}

