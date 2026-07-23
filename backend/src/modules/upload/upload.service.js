import { createUpload as createUploadRepo, listUploads } from "./upload.repository.js";

export function createUpload(data) {
  return createUploadRepo(data);
}

export function getUploads() {
  return listUploads();
}

