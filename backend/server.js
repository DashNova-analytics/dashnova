import app from "./app.js";
import { PORT } from "./src/config/env.js";

const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => server.close());

