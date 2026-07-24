import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import organizationRoutes from "../modules/organization/organization.routes.js";
import uploadRoutes from "../modules/upload/upload.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import analyticsRoutes from "../modules/analytics/analytics.routes.js";
import forecastingRoutes from "../modules/forecasting/forecasting.routes.js";
import reportsRoutes from "../modules/reports/reports.routes.js";
import aiRoutes from "../modules/ai/ai.routes.js";
import customersRoutes from "../modules/customers/customers.routes.js";
import productsRoutes from "../modules/products/products.routes.js";

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.use("/uploads", uploadRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/forecasting", forecastingRoutes);
router.use("/reports", reportsRoutes);
router.use("/ai", aiRoutes);
router.use("/customers", customersRoutes);
router.use("/products", productsRoutes);

export default router;

