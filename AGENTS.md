# AGENTS.md — The Gypsi Project Architecture

This document provides an overview of the project structure for developers and AI agents working on this codebase.

## Project Overview

A premium marketing website for The Gypsi botanical skincare brand. Features the full product line, brand story, cart drawer, and newsletter signup. Built with TanStack Start (SSR React) and deployed on Netlify.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Custom CSS (design tokens) + Tailwind CSS 4 (available) |
| Language | TypeScript 5 (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
public/img/             — Product and hero/campaign photos (jpeg)
src/
  routes/
    __root.tsx          — Root layout: sets <html data-theme>, loads Google Fonts, imports gypsi.css
    index.tsx           — Home page: GypsiApp with cart state + all section components
    products/           — Template scaffold leftover; unused, safe to delete
  gypsiComponents.tsx   — Shared primitives: Reveal (scroll animation), Btn, ICON map, Ring, Wordmark
  gypsiData.ts          — Static brand content: benefits, ingredients, ritual steps, product line, reviews
  gypsiSections.tsx     — All page sections: Nav, Hero, MarqueeBand, Ritual, ProductFeature, Ingredients,
                          Line, Campaign, Reviews, Newsletter, Footer, CartDrawer
  gypsi.css             — Full design token system (CSS custom properties), resets, typography, animations
  styles.css            — Tailwind import (kept from scaffold; not actively used by Gypsi design)
```

## Key Concepts

### Design System

- **Palette**: CSS vars `--bg`, `--bg-alt`, `--bg-deep`, `--ink`, `--ink-soft`, `--ink-mute`, `--line`, `--card`, `--forest`, `--sage`, `--moss`, `--sand`
- **Dark mode**: Toggle `data-theme="dark"` on `<html>` to activate the Nightfall palette
- **Typography**: `.eyebrow`, `.display`, `.h1–h3`, `.serif-quote`, `.lede`, `.tracked` classes; fonts Jost + Cormorant Garamond loaded from Google Fonts
- **Spacing**: `--space` multiplier on `.section` padding

### File-Based Routing (TanStack Router)

- `__root.tsx` — root layout wrapping all pages
- `index.tsx` — route for `/`
- Routes in `src/routes/products/` are unused template leftovers

### Cart State

Cart lives entirely as `useState` in `GypsiApp` (index.tsx) — no global store. `addToCart` and `changeQty` are passed as props to sections that need them.

### Scroll Animations

`Reveal` component in `gypsiComponents.tsx` uses IntersectionObserver to fade/slide elements in as they enter the viewport. Elements already in view on mount are revealed immediately.

## Conventions

- All styling is inline React styles or CSS class names from `gypsi.css` — no Tailwind utilities in Gypsi components
- Images use absolute paths (`/img/*.jpeg`) served from `public/img/`
- Components are plain React functional components; no context or Zustand needed
- TypeScript strict mode; use `React.CSSProperties` for inline style types

## Development Commands

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build
netlify dev --port 8889  # Local Netlify emulation
```
