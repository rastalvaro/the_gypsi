# Production image for Coolify (set Build Pack = Dockerfile).
# Stage 1 runs the full Vite build (gen-theme → gen-products → vite build →
# SSR build → prerender); stage 2 serves the static output with Caddy.
#
# VITE_* are inlined at build time, so they must be passed as build args in
# Coolify (Build Variables). VITE_SITE_URL drives canonical/Snipcart URLs and
# the prerender env-parity guard; VITE_SNIPCART_KEY activates the cart (omit to
# keep it dormant). Image variants are committed to the repo (gen:images is not
# part of the build), so no ImageMagick/avifenc is needed here.

# ---------- build ----------
FROM node:20-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_SITE_URL
ARG VITE_SNIPCART_KEY
ENV VITE_SITE_URL=${VITE_SITE_URL}
ENV VITE_SNIPCART_KEY=${VITE_SNIPCART_KEY}
RUN npm run build

# ---------- serve ----------
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
# Caddy listens on :3000 to match Coolify's default app port + healthcheck.
EXPOSE 3000
