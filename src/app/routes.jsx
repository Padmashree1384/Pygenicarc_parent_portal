import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import Demo from "./components/Demo";
import sessionRoutes from "./views/sessions/session-routes";

const routes = [
  { path: "/", element: <Navigate to="dashboard/default" /> },
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      // dashboard route
      { path: "/dashboard/default", element: <Demo />, auth: authRoles.admin },
      // e-chart route
      { path: "/charts/echarts", element: <Demo />, auth: authRoles.editor },
      // material routes (reduced to 5 pages)
      { path: "/material/autocomplete", element: <Demo /> },
      { path: "/material/buttons", element: <Demo /> },
      { path: "/material/checkbox", element: <Demo /> },
      { path: "/material/dialog", element: <Demo /> },
      { path: "/material/form", element: <Demo /> }
    ]
  },

  // session pages route
  ...sessionRoutes
];

export default routes;
