import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js";
import { errorHandler } from "./src/middleware/error.middleware.js";
import { logger } from "./src/middleware/logger.middleware.js";
import { rateLimiter } from "./src/middleware/rateLimit.middleware.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve(__dirname, "./src/docs/openapi.json"), "utf-8"));

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(rateLimiter);
app.use("/api", routes);
app.use("/api/v1", routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);

export default app;

