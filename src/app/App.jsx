import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
// ROOT THEME PROVIDER
import { ParcTheme } from "./components";
// ALL CONTEXTS
import SettingsProvider from "./contexts/SettingsContext";
// ROUTES
import routes from "./routes";
// SCROLL TO TOP ON ROUTE CHANGE
import ScrollToTop from "./components/ScrollToTop";
// FAKE SERVER


export default function App() {
  const content = useRoutes(routes);

  // Disable browser scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <SettingsProvider>
      <ParcTheme>
        <CssBaseline />
        <ScrollToTop />
        {content}
      </ParcTheme>
    </SettingsProvider>
  );
}
