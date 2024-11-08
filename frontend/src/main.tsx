// src/main.tsx
import React from "react"; 
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/landing/landingPage/theme-provider.tsx";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import  {store ,persistor} from "./store/store.ts"; // Update import

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}> {/* Add PersistGate */}
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <StrictMode>
          <App />
        </StrictMode>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
