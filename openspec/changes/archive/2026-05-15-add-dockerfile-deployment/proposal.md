# Change: Switch Coolify Deployment from Nixpacks to Custom Dockerfile

## Why

The current Coolify deployment uses Nixpacks (Build Pack) + nginx:alpine (Static Image) + a custom inline nginx config. Investigation of repeated production incidents (CSS 404s, missing JS chunks, partial deployments, stale `PWAUpdatePrompt.r9-Yv21t.js` files persisting after deletion) confirmed via direct server fetches that:

- The server's `/_astro/` directory contains a **mix of files from at least three different builds that never coexisted** — some new-build files (`AuthGuard.CXunGCbI.js`), some files from deleted commits (`PWAUpdatePrompt.r9-Yv21t.js`), and missing-on-server files referenced by the current HTML (`global.BBmuXjD7.css`, `use-session-store.SlQ9hjdw.js`).
- Coolify's static-site Nixpacks flow does **incremental layer overlay** on the nginx image rather than a clean replacement, leaving orphaned files from previous deployments.
- The Coolify UI force-prefixes the Publish Directory with `/` (cannot be removed by the user), preventing the obvious config-level fix.
- Nixpacks has known compatibility issues with pnpm 10's strict content-addressable store + symlink structure, contributing to inconsistent build artifacts.

A versioned, multi-stage Dockerfile eliminates Nixpacks entirely, guarantees a clean image with a deterministic `_astro/` directory each deployment, and moves the nginx config into git where it belongs (instead of an inline Coolify field that can't be reviewed or rolled back).

## What Changes

- **NEW** `Dockerfile` at repo root — multi-stage: build with Node 22 + Corepack-pinned pnpm 10.18.3 → serve from `nginx:alpine`. Build-time `PUBLIC_*` env vars are passed via Docker `ARG` (Vite inlines them at build time).
- **NEW** `nginx.conf` at repo root — production nginx configuration baked into the image. Includes: gzip, security headers, no-cache for `sw.js`/`workbox-*.js`/`manifest.webmanifest`, long-term immutable caching for `_astro/*` assets, SPA-style `try_files`, offline fallback. Replaces the inline Coolify nginx config.
- **NEW** `.dockerignore` at repo root — excludes `node_modules`, `dist`, `.git`, `.env*`, `openspec/`, `.playwright-cli/`, `temp.json`, logs.
- **Coolify settings update** (manual, documented in tasks): change Build Pack from `Nixpacks` to `Dockerfile`; move `PUBLIC_N8N_BASE_URL` and `PUBLIC_RECORD_DURATION_SECONDS` from runtime env vars to **Build-time** env vars (so they reach Docker `ARG`); clear the inline custom nginx configuration field; clear build cache before first redeploy.
- **Spec update**: `package-management` — modify the "Coolify Deployment via pnpm" requirement to reflect the Dockerfile-based build pipeline.

## Impact

- **Affected specs**: `package-management`
- **Affected code (new files)**:
  - `Dockerfile`
  - `nginx.conf`
  - `.dockerignore`
- **Affected infrastructure**:
  - Coolify build pack (Nixpacks → Dockerfile)
  - Coolify env vars promoted to build-time
  - Inline Coolify nginx config removed (replaced by file in repo)
- **No application code changes** required. The Astro build output (`dist/`) and runtime behavior are unchanged.
