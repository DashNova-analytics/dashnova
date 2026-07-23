import express from "express";
import { uploadMiddleware } from "../../middleware/upload.middleware.js";
import { uploadFile, listUploads } from "./upload.controller.js";

const router = express.Router();
router.post("/", uploadMiddleware.single("file"), uploadFile);
router.get("/", listUploads);
export default router;

