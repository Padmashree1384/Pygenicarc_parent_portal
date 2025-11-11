import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// ROOT APP COMPONENT
import App from "./App";
// THIRD PARTY CSS - BASE TEMPLATE
import "perfect-scrollbar/css/perfect-scrollbar.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);