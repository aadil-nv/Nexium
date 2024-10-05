import React from "react"; // Add this import
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./Components/Landing/landingPage/theme-provider.tsx";



createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <StrictMode>
      <App />
    </StrictMode>
    </ThemeProvider>
);
