import prisma from "../../config/prisma.js";

export function createUpload(data) {
  return prisma.upload.create({ data });
}

export function listUploads() {
  return prisma.upload.findMany({ orderBy: { createdAt: "desc" } });
}

