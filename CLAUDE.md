# CLAUDE.md — The Gypsi (Vite build)

Context for Claude Code. This is the **production codebase** for The Gypsi storefront:
**Vite + React 18 + TypeScript + Tailwind CSS 4**, deployed static to Netlify. Read fully
before changing things.

## What this is

A single-page botanical-skincare marketing/storefront site. No backend. Content is a typed
TS module; the store is Snipcart (dormant until a key is set); the newsletter is Netlify Forms.

## Stack & why

- **Vite 7** dev/build. `npm run dev` / `npm run build` / `npm run preview`.
- **React 18** with the automatic JSX runtime (`jsx: react-jsx`). No `import React` needed.
- **TypeScript**, but **the build does NOT typecheck** (`vite build` strips types). Run
  `npm run typecheck` (`tsc --noEmit`) separately. This is intentional so a stray type nit
  never blocks a deploy — but keep types clean.
- **Tailwind 4** via `@tailwindcss/vite` (no `tailwind.config.js`; tokens live in CSS).

## How it boots

`index.html` → `src/main.tsx` imports `index.css`, calls `initSnipcart()`, renders `<App/>`.
`App.tsx` composes the sections from `src/sections.tsx`. All of them read from the single
`content` object in `src/content.ts`.

## Content model

- **`src/content.ts`** is the single source of truth for all copy/products/prices/photos,
  typed by **`src/types.ts`**. This is the file to edit for content changes.
- Images live in `public/img/` and are referenced as `/img/<file>` (served from web root).
- Exactly one product in `content.line` should have `featured: true` (fills the large serum
  block). Product `id` must be unique, lowercase, no spaces (used as React key + Snipcart id).

## Styling

- **`src/index.css`**: Tailwind 4 `@theme` defines brand tokens → utilities (`bg-sand`,
  `text-ink`, `text-moss`, `font-display`, …) **and** CSS vars (`var(--color-ink)`, …).
- The same file holds the brand component classes ported from the original site: `.eyebrow`,
  `.display/.h1/.h2/.h3`, `.serif-quote`, `.lede`, `.btn` (+ `--ghost/--light`),
  `.link-underline`, `.reveal`, `.ring`, `.marquee`.
- Sections use **Tailwind utilities for layout/responsive** (e.g. `grid grid-cols-1
  md:grid-cols-4`) and inline styles + CSS vars for brand colors / gradients. This keeps exact
  visual fidelity with the original. `color-scheme: only light` is set so browser auto-dark
  mode never inverts the design — keep it.

## Store (Snipcart)

- `src/lib/snipcart.ts`: `initSnipcart()` loads Snipcart **only if `VITE_SNIPCART_KEY` is set**
  (else dormant, console-clean). `snip(product)` returns the `snipcart-add-item` data-attributes
  for buy buttons. The nav cart button is `class="snipcart-checkout"` with `snipcart-items-count`.
- **Price validation:** buy buttons use `data-item-url="/products.html"`. That page is
  **generated from `content.ts`** by `scripts/gen-products.mjs`, which runs in the `build`
  script (`npm run build`). Never hand-edit `public/products.html`. If you change products,
  a rebuild keeps prices authoritative.
- The script parses `content.ts` textually (regex) to avoid needing a TS loader in Node. If you
  significantly restructure the `line` array shape, update the script too.
- Activate by setting `VITE_SNIPCART_KEY` in `.env` (local) and in Netlify env vars (prod).

## Newsletter (Netlify Forms)

- A hidden static `<form name="newsletter" data-netlify="true">` in `index.html` lets Netlify's
  build-time detector register the form. The React form in `Newsletter` (sections.tsx) POSTs
  url-encoded data (including `form-name=newsletter`) to `/`. Submissions show in Netlify → Forms.
- This only works on Netlify (or with the Netlify CLI). Locally the POST 404s — that's expected.

## Deploy

- `netlify.toml`: `command = "npm run build"`, `publish = "dist"`, SPA redirect + headers.
- Cloudflare DNS → Netlify; add `VITE_SNIPCART_KEY` env var when enabling the store.

## Conventions & gotchas

- **No typecheck in build** (see above) — run `npm run typecheck` before committing big changes.
- **Tailwind 4 = no JS config**; add/rename tokens in the `@theme` block in `src/index.css`.
- **One featured product**; unique product ids.
- **`public/products.html` is generated** — edit `content.ts` or the script, never the output.
- **Keep `color-scheme: only light`** in `:root`.
- **Adding a page/route:** there's no router yet (single page). Add `react-router-dom` if you
  need real routes, and keep the `netlify.toml` SPA redirect.

## Common tasks

- **Edit content/products/prices:** `src/content.ts`.
- **Restyle/theme:** tokens at the top of `src/index.css` (`@theme`).
- **New section:** add a component in `src/sections.tsx`, place it in `App.tsx`.
- **Enable store:** set `VITE_SNIPCART_KEY`.
