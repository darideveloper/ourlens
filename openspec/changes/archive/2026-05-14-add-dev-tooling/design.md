## Context

The Ourlens project is an Astro frontend PWA with no backend server (uses n8n for backend orchestration). The current dev workflow requires running `npm run dev` and separately managing cloudflare tunnels. This adds friction when testing features that require HTTPS (PWA service workers, camera API) or a public URL (Stripe webhooks via n8n).

## Goals / Non-Goals

- Goals:
  - Single command (`./dev.sh`) to start all dev services
  - Fixed port 4321 for the Astro dev server
  - Public tunnel URL for webhook testing: `https://ourlens.darideveloper.com` (via cloudflared)
  - Re-attachment to existing tmux sessions
- Non-Goals:
  - No production deployment changes
  - No CI/CD integration
  - No configuration of n8n or backend services (project is frontend-only)

## Decisions

### Decision 1: Two tmux windows (astro + tunnel) vs single window

Chose two separate tmux windows so developers can inspect cloudflared logs independently from Astro dev server output. Both services run in the same session so `Ctrl+b d` detaches everything.

Alternatives considered: Single window with background processes — rejected because log output would interleave and be hard to read.

### Decision 2: Fixed port 4321

The Astro dev server always runs on port 4321 (Astro default). No dynamic port detection is needed since developers typically work on one project at a time.

### Decision 3: `dev.sh` committed to repository

`dev.sh` is a shared developer tool that contains no secrets, credentials, or environment-specific paths — only project-relative names, CLI invocations, and port detection logic. It lives at the project root and is tracked in git so all team members benefit from it.

### Decision 4: Cloudflared named tunnel with inline config

The `dev.sh` script creates a temporary cloudflared config file with the tunnel credentials and ingress pointing to `http://localhost:4321`. This avoids modifying the global `~/.cloudflared/config.yml` and keeps the tunnel configuration self-contained in the script.

Alternatives considered: `cloudflared tunnel --url` (ad-hoc tunnel) — rejected because it generates a random `*.trycloudflare.com` URL instead of the configured `ourlens.darideveloper.com` domain.

## Risks / Trade-offs

- **Risk**: `cloudflared` not installed on developer machine
  - Mitigation: Script checks for binary availability and exits with clear error message
- **Risk**: Port 4321 already in use
  - Mitigation: Developer can stop the conflicting process or the script can be enhanced to detect and warn

## Open Questions

- Should `dev.sh` also manage n8n Docker startup? (Out of scope for now — n8n runs on a remote Hetzner VPS)
