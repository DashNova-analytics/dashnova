import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { createServer as createViteServer } from "vite";
import app from "./backend/app.js";

const PORT = 3000;

async function startServer() {

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
      root: path.resolve(process.cwd(), "frontend"),
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "frontend/dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Unified server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
