import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initSnipcart } from "./lib/snipcart";
import "./index.css";

initSnipcart();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
