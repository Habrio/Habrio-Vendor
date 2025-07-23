// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global styles
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/common.css";
import "./styles/App.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("❌ Root element not found. Make sure <div id='root'></div> exists in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
