
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/landing/landingPage/theme-provider.tsx";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import  {store ,persistor} from "./redux/store/store.ts"; // Update import
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID =import.meta.env.VITE_GOOGLE_CLIENT_ID


createRoot(document.getElementById("root")!).render(

  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}> {/* Add PersistGate */}
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <StrictMode>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </StrictMode>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
