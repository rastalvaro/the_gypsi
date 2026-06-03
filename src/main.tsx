import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initSnipcart } from "./lib/snipcart";
import "./index.css";

initSnipcart();

const container = document.getElementById("root")!;
const tree = (
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

// In a production build the homepage is prerendered into #root (see
// scripts/prerender.mjs + src/entry-server.tsx), so we hydrate the existing markup.
// In `npm run dev` #root is empty (no prerender step), so we mount a fresh client
// root instead — hydrating an empty container would log a mismatch and discard it.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
