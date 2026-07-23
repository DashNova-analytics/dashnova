import express from "express";
import { register, login, syncUser } from "./auth.controller.js";
import { authValidator } from "./auth.validator.js";

const router = express.Router();
router.post("/register", authValidator, register);
router.post("/login", login);
router.post("/sync", syncUser);

export default router;

