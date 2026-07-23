import express from "express";
import { getForecast } from "./forecasting.controller.js";
const router = express.Router();
router.get("/", getForecast);
export default router;

