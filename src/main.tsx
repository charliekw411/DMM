// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import AppPages from "./components/pages/appPages";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AppPages />
  </React.StrictMode>
);
