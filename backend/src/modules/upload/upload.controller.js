import { createUpload, getUploads } from "./upload.service.js";

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }
    const upload = await createUpload({
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      metadata: req.body.metadata ? JSON.parse(req.body.metadata) : null,
      userId: req.body.userId,
      organizationId: req.body.organizationId,
    });
    res.status(201).json(upload);
  } catch (error) {
    next(error);
  }
}

export async function listUploads(req, res, next) {
  try {
    const uploads = await getUploads();
    res.json(uploads);
  } catch (error) {
    next(error);
  }
}

