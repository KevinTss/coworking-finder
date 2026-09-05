import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./styles/index.css";

function restoreGitHubPagesRoute() {
  const { location, history } = window;

  if (location.search.startsWith("?/")) {
    const restoredPath = location.search.slice(1).replace(/&/g, "?");
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    history.replaceState(null, "", `${base}${restoredPath}${location.hash}`);
  }
}

restoreGitHubPagesRoute();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
