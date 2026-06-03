# The Gypsi — Clean Botanical Skincare

A premium marketing website for The Gypsi skincare brand, built with TanStack Start and React.

## About

The Gypsi is a botanical skincare brand with a tropical, bohemian aesthetic. This site showcases their hero product — The Miracle Serum — along with the full product line, brand story, and newsletter signup.

## Key Technologies

- **TanStack Start** (React SSR framework)
- **TanStack Router** (file-based routing)
- **Tailwind CSS v4** (utility classes available, but the design uses custom CSS variables)
- **Netlify** (hosting + edge functions)
- Custom CSS design system with warm botanical color tokens

## Running Locally

```bash
npm install
npm run dev
```

The dev server starts on port 3000. For Netlify features (functions, forms, etc.), use:

```bash
netlify dev --port 8889
```

## Design System

The site uses CSS custom properties (`--bg`, `--ink`, `--moss`, `--forest`, etc.) for theming. A dark "Nightfall" mode is supported by toggling `data-theme="dark"` on the `<html>` element.

Fonts: **Jost** (display/body), **Cormorant Garamond** (serif accent) — loaded from Google Fonts.
