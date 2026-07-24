import express from "express";
import { getAIResponse, postAIChat } from "./ai.controller.js";
const router = express.Router();

router.get("/", getAIResponse);
router.post("/chat", postAIChat);

export default router;


