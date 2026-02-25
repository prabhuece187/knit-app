// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/theme/theme-provider";
import { Provider } from "react-redux";
import { store, persistor } from "@/store/Store";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </PersistGate>
  </Provider>
  // </StrictMode>,
);
