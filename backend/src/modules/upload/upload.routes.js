import express from "express";
import { uploadMiddleware } from "../../middleware/upload.middleware.js";
import { uploadFile, listUploads, syncParsedData } from "./upload.controller.js";

const router = express.Router();
router.post("/", uploadMiddleware.single("file"), uploadFile);
router.get("/", listUploads);
router.post("/sync", syncParsedData);
export default router;


