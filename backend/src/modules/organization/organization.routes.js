import express from "express";
import { createOrganization, listOrganizations } from "./organization.controller.js";

const router = express.Router();
router.post("/", createOrganization);
router.get("/", listOrganizations);
export default router;

