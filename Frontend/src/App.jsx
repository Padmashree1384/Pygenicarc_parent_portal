import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

// BASE TEMPLATE COMPONENTS (KEEP ALL)
import ParcTheme from "./app/components/ParcTheme/ParcTheme";
import ScrollToTop from "./app/components/ScrollToTop";

// BASE TEMPLATE CONTEXTS (KEEP ALL)
import SettingsProvider from "./app/contexts/SettingsContext";

// ROUTES (COMBINED)
import routes from "./app/routes";

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