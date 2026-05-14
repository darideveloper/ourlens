# Change: Add Unified Development Script

## Why

Developers currently need to manually start the Astro dev server and cloudflare tunnels separately. This creates friction when switching between projects, testing webhooks (Stripe/OAuth), or working with subdomain-based features. A unified `dev.sh` script orchestrated via `tmux` with `cloudflared` for public tunnel provides a one-command dev environment with a consistent URL.

## What Changes

- Create `dev.sh` at project root (committed to repo) that:
  - Starts a named `tmux` session with the project name
  - Runs the Astro dev server on fixed port 4321
  - Launches `cloudflared tunnel run ourlens` in a separate `tmux` window, proxying to `http://localhost:4321`
  - Handles re-attachment to existing sessions gracefully
- Add `.env.example` with `ALLOWED_HOSTS` default
- Update `astro.config.mjs` to read `server.allowedHosts` from `ALLOWED_HOSTS` environment variable

## Impact

- Affected specs: New capability `dev-tooling`
- Affected code:
  - New: `dev.sh` (project root, committed to repo)
  - New: `.env.example` (project root)
  - Modified: `astro.config.mjs` (env-driven `allowedHosts`)
- Dependencies: `tmux`, `cloudflared` (developer machine prerequisites, documented in `.env.example` or README)
