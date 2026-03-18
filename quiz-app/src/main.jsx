import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./themes/dark.css"; // Import dark theme

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
