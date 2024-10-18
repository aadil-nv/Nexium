import React from "react"; // Add this import
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/landing/landingPage/theme-provider.tsx"
import {Provider} from "react-redux";
import store from "./store/store.ts";


// Inside your main app component





createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <StrictMode>
    
      <App />
    </StrictMode>
    </ThemeProvider>
    </Provider>
);
