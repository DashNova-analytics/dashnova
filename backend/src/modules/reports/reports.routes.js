import express from "express";
import { getReports } from "./reports.controller.js";
const router = express.Router();
router.get("/", getReports);
export default router;

