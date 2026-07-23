import express from "express";
import { createProduct, listProducts } from "./products.controller.js";

const router = express.Router();
router.post("/", createProduct);
router.get("/", listProducts);
export default router;

