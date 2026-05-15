## Context

Coolify's Nixpacks static-site mode has produced inconsistent production deployments. Direct server fetches (via Playwright) confirmed the server's `/_astro/` folder mixes files from at least three different builds — some files referenced by the current HTML are 404, while deleted files from earlier commits remain accessible. Combined with Coolify's UI locking the Publish Directory leading slash and Nixpacks' weak support for pnpm 10's symlink structure, no config-only fix is reachable.

Stakeholders:
- Production users hitting CSS/JS 404s and broken hydration
- Mobile PWA users running stale service workers (separate fix already deployed via `fix-pwa-stale-sw-and-meta`)
- Owner/developer needing reproducible, auditable deployments

## Goals / Non-Goals

**Goals**:
- Deterministic deployments: the same git SHA + same env vars MUST produce a byte-identical image.
- Every deployment starts from a clean nginx serving directory — no orphaned files from previous builds.
- nginx configuration is versioned in git and reviewable in PRs (not pasted into a Coolify field).
- Build-time env vars (`PUBLIC_*`) are explicit Docker `ARG` declarations so the failure mode of a missing env var is loud (build fails) instead of silent (USE_DUMMY fallback in production).
- No changes to application code, dependencies, or runtime behavior.

**Non-Goals**:
- Adding a CI pipeline (GitHub Actions, etc.) for image builds — Coolify continues to build on push.
- Pushing images to an external registry — Coolify builds locally and runs locally.
- Adding HTTPS/cert management — Traefik in front of Coolify handles TLS.
- Optimizing image size beyond what `nginx:alpine` and multi-stage gives for free.

## Decisions

### Decision 1: Multi-stage Dockerfile, build with `node:22-alpine`, serve with `nginx:alpine`

```
Stage 1 (build): node:22-alpine
  - corepack enable + corepack prepare pnpm@10.18.3 --activate
  - pnpm install --frozen-lockfile (cached layer)
  - pnpm build → dist/

Stage 2 (serve): nginx:alpine
  - COPY --from=build /app/dist /usr/share/nginx/html
  - COPY nginx.conf /etc/nginx/conf.d/default.conf
```

**Why Alpine for both**: smaller image (~40MB final), matches Coolify's existing static image expectation.

**Why Node 22**: `package.json` declares `"engines": { "node": ">=22.12.0" }`. Node 22 alpine has Corepack bundled.

**Why pin pnpm via Corepack**: `package.json` already pins `"packageManager": "pnpm@10.18.3"`. Corepack reads it automatically. Avoids `npm i -g pnpm` and version drift.

**Alternatives considered**:
- Single-stage with Node serving static files: rejected — nginx is faster, has better caching/compression, smaller runtime image.
- `pnpm/pnpm:10` image: rejected — adds an indirection, larger base, harder to debug than vanilla `node:22-alpine` + corepack.

### Decision 2: Pass `PUBLIC_*` env vars as Docker `ARG`, not runtime `ENV`

Vite/Astro inlines `import.meta.env.PUBLIC_*` at **build time**. Once `dist/` is built, those values are baked into the JS chunks. Runtime env vars in the final nginx image have no effect.

```dockerfile
ARG PUBLIC_N8N_BASE_URL
ARG PUBLIC_RECORD_DURATION_SECONDS
ENV PUBLIC_N8N_BASE_URL=$PUBLIC_N8N_BASE_URL
ENV PUBLIC_RECORD_DURATION_SECONDS=$PUBLIC_RECORD_DURATION_SECONDS
RUN pnpm build
```

Coolify supports build-time args — they must be configured on the **Build Args / Build-time Environment Variables** section, not the Runtime Environment Variables section. Tasks.md flags this as a separate manual step because confusing the two is the most likely deployment mistake.

**Why explicit `ARG` declarations (not just `--build-arg` passthrough)**: makes the contract visible at the top of the Dockerfile. Anyone reviewing the file sees exactly which env vars the build needs.

### Decision 3: Bake `nginx.conf` into the image, not into Coolify's UI

The current inline Coolify nginx config is invisible to code review and to `git blame`. Baking it into the image means:
- PR-reviewable nginx changes
- Rollback via `git revert` works for nginx changes
- Local `docker build` reproduces the exact production server behavior

Coolify's "Custom Nginx Configuration" field MUST be cleared as part of the cutover, or it will silently override the file in the image (depending on Coolify's mount behavior — safer to assume it does and clear it).

### Decision 4: `.dockerignore` aggressively excludes non-source files

Avoids cache invalidation on irrelevant changes (e.g., `openspec/` edits shouldn't trigger a rebuild) and keeps the build context small (faster Coolify uploads).

Excluded: `node_modules`, `dist`, `.git`, `.github`, `.env*`, `openspec/`, `.playwright-cli/`, `playwright-report/`, `test-results/`, `temp.json`, `*.log`, `.vscode/`, `.idea/`, `README.md`, `CLAUDE.md`.

### Decision 5: nginx config — same as the version produced earlier in conversation, with one addition

The nginx config drafted earlier in this session is the baseline. It already handles:
- gzip
- security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Never-cache for `sw.js`, `workbox-*.js`
- Never-cache for `manifest.webmanifest`
- Immutable long-term caching for `_astro/*` assets
- `try_files` for SSG routes with trailing slashes
- offline fallback for 404s

Addition: explicit `listen 80` with no upstream — the image is meant to run behind Coolify/Traefik, so TLS termination happens upstream.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Build-time env vars confused with runtime env vars in Coolify | tasks.md documents both fields explicitly; nginx.conf has a comment near `_astro/` block reminding readers |
| Coolify "Custom Nginx Configuration" field left populated, silently overrides image config | tasks.md step explicitly requires clearing this field before redeploy |
| Docker layer cache could still cause issues if Coolify doesn't honor a clean build | tasks.md requires "Clear build cache" before first cutover deploy |
| Build time increases (now includes Docker context upload + image build, not just static asset copy) | acceptable — predictability > speed for production deployments |
| pnpm cache not preserved across builds → slower installs | acceptable — Coolify's BuildKit layer caching covers the `pnpm install` layer when `pnpm-lock.yaml` is unchanged |
| Image must rebuild fully when any source file changes | acceptable for this project size (build is ~10s; image build is dominated by `pnpm install` which is cached) |

## Migration Plan

1. Land the Dockerfile, nginx.conf, and .dockerignore in git (this change).
2. Test locally: `docker build -t ourlens . && docker run -p 8080:80 ourlens` and verify the site loads at `http://localhost:8080`.
3. In Coolify (single switchover deployment window):
   a. Move `PUBLIC_N8N_BASE_URL` and `PUBLIC_RECORD_DURATION_SECONDS` to Build-time / Build Args.
   b. Clear the "Custom Nginx Configuration" field.
   c. Change Build Pack from Nixpacks to Dockerfile.
   d. Clear build cache.
   e. Redeploy.
4. Verify via Playwright (or direct fetch): all `_astro/*` files referenced by HTML return 200; no orphaned files from prior builds remain.
5. Rollback path: revert the Coolify Build Pack to Nixpacks and revert the env var move. The old inline nginx config is preserved in the prior `fix-pwa-stale-sw-and-meta` archive notes if needed; otherwise pull from this proposal's `nginx.conf`.

## Open Questions

- Does Coolify's Dockerfile build pack require an explicit `EXPOSE` directive for routing? (Answer expected: yes, port 80 — already in the proposed Dockerfile.)
- Will Coolify's Traefik labels in front of the container survive the build-pack switch unchanged? (Should — they're attached to the resource, not the build pack. Verify after deploy.)
