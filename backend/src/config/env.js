import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const PORT = Number(process.env.PORT ?? 4000);
export const DATABASE_URL = process.env.DATABASE_URL;
export const MONGODB_URI = process.env.MONGODB_URI ?? process.env.DATABASE_URL;
export const REDIS_URL = process.env.REDIS_URL;
export const CLERK_API_KEY = process.env.CLERK_API_KEY;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

