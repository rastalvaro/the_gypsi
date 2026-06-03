import { renderToString } from "react-dom/server";
import App from "./App";

/**
 * Server entry — consumed ONLY by the SSR build (`vite build --ssr`) at prerender
 * time. `scripts/prerender.mjs` imports the compiled output, calls render(), and
 * injects the returned HTML string into dist/index.html's #root (build-time
 * prerendering for SEO + no-JS visitors).
 *
 * Intentionally minimal — keep it that way:
 *  - Renders bare <App/> (no <StrictMode>/<ErrorBoundary>): both wrappers emit zero
 *    DOM, so the output is identical to what the client hydrates, AND a render error
 *    here throws and fails the build loudly instead of silently shipping the
 *    ErrorBoundary fallback. (The client keeps both wrappers — see main.tsx.)
 *  - No `import "./index.css"`: the client build owns the hashed stylesheet <link>
 *    that already lands in dist/index.html.
 *  - No initSnipcart(): it touches `document` and must stay client-only.
 *
 * renderToString (not a streaming API) is correct: <App/> is fully synchronous with
 * no Suspense/data-fetching — every window/document access lives inside useEffect,
 * which the server renderer never runs.
 */
export function render(): string {
  return renderToString(<App />);
}
