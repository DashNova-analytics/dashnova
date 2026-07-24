import { PORT } from "./src/config/env.js";
import app from "./app.js";

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Retrying ${nextPort}...`);
      server.removeAllListeners("error");
      startServer(nextPort);
      return;
    }

    console.error(error);
    process.exit(1);
  });

  process.on("SIGTERM", () => server.close());
}

startServer(PORT);

