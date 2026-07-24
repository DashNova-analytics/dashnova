import prisma from "../../config/prisma.js";

export function getUserByEmail(email) {
  if (!email) return null;
  return prisma.user.findUnique({
    where: { email },
    include: { organization: true },
  });
}

export function getUserByClerkId(clerkId) {
  if (!clerkId) return null;
  return prisma.user.findFirst({
    where: {
      OR: [
        { clerkUserId: clerkId },
        { clerkId: clerkId },
      ],
    },
    include: { organization: true },
  });
}

export function createUser(data) {
  return prisma.user.create({
    data,
    include: { organization: true },
  });
}

export function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
    include: { organization: true },
  });
}


