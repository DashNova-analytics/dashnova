import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const appShell = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {clerkPubKey ? (
      <ClerkProvider publishableKey={clerkPubKey}>{appShell}</ClerkProvider>
    ) : (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">Clerk configuration missing</h1>
          <p className="mt-2 text-sm text-gray-600">
            Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in your environment and restart the dev server.
          </p>
        </div>
      </div>
    )}
  </React.StrictMode>
);