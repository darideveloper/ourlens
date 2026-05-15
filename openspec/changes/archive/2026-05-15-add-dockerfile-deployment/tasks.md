## 1. Repository Files
- [x] 1.1 Create `Dockerfile` at repo root with two stages:
  - Stage `build` from `node:22-alpine`: enable Corepack, prepare `pnpm@10.18.3`, `COPY package.json pnpm-lock.yaml`, `pnpm install --frozen-lockfile`, `COPY . .`, declare `ARG PUBLIC_N8N_BASE_URL` and `ARG PUBLIC_RECORD_DURATION_SECONDS` with corresponding `ENV` lines, `RUN pnpm build`.
  - Stage `serve` from `nginx:alpine`: `COPY --from=build /app/dist /usr/share/nginx/html`, `COPY nginx.conf /etc/nginx/conf.d/default.conf`, `EXPOSE 80`, default `CMD` from base image.
- [x] 1.2 Create `nginx.conf` at repo root with the production config (gzip, security headers, no-cache for `sw.js`/`workbox-*.js`/`manifest.webmanifest`, immutable long-term caching for `_astro/*`, `try_files` with trailing-slash support, `error_page 404 /offline/index.html`).
- [x] 1.3 Create `.dockerignore` at repo root excluding: `node_modules`, `dist`, `.git`, `.github`, `.env*`, `openspec/`, `.playwright-cli/`, `playwright-report/`, `test-results/`, `temp.json`, `*.log`, `.vscode/`, `.idea/`, `README.md`, `CLAUDE.md`.

## 2. Local Build Verification
- [ ] 2.1 `docker build --build-arg PUBLIC_N8N_BASE_URL=https://n8n.apps.darideveloper.com/webhook/ourlens -t ourlens-test .` succeeds. *(Skipped locally — host user not in docker group; verification deferred to Coolify build.)*
- [ ] 2.2 `docker run --rm -p 8080:80 ourlens-test` serves the site at `http://localhost:8080`. *(Deferred — same reason as 2.1.)*
- [ ] 2.3 Inside the running container, confirm `ls /usr/share/nginx/html/_astro/` lists ALL files from a local `pnpm build` (no missing chunks). *(Deferred — same reason as 2.1.)*
- [ ] 2.4 Verify `curl -I http://localhost:8080/sw.js` returns `Cache-Control: no-cache, no-store, must-revalidate`. *(Deferred — same reason as 2.1.)*
- [ ] 2.5 Verify `curl -I http://localhost:8080/_astro/global.*.css` returns `Cache-Control: public, max-age=31536000, immutable`. *(Deferred — same reason as 2.1.)*
- [x] 2.6 `pnpm build` runs clean (no regressions from new files) — verified, 5 pages built in 7.91s.

## 3. Coolify Switchover (manual, single deployment window)
- [ ] 3.1 In Coolify → Configuration → Environment Variables: move `PUBLIC_N8N_BASE_URL` and `PUBLIC_RECORD_DURATION_SECONDS` to **Build-time** (Build Args) — NOT runtime env.
- [ ] 3.2 In Coolify → Configuration → General: clear the entire "Custom Nginx Configuration" field.
- [ ] 3.3 In Coolify → Configuration → General: change Build Pack from `Nixpacks` to `Dockerfile`. Leave the Install Command / Build Command fields blank (Dockerfile handles them).
- [ ] 3.4 In Coolify → Configuration → Advanced (or Danger Zone): clear build cache.
- [ ] 3.5 Trigger a redeploy.

## 4. Production Verification
- [ ] 4.1 Via Playwright (or `curl --cache 'no-store'`): confirm the served HTML at `/` references `mobile-web-app-capable` (not `apple-mobile-web-app-capable`), has no `PWAUpdatePrompt` reference, and links to `_astro/global.*.css`.
- [ ] 4.2 Fetch every `_astro/*` asset referenced by the served HTML and confirm all return 200 (no 404s).
- [ ] 4.3 Confirm `/_astro/PWAUpdatePrompt.*.js` (any hash) returns 404 — the orphaned file from the prior deployment must no longer be reachable.
- [ ] 4.4 Confirm `/sw.js` response headers include `Cache-Control: no-cache, no-store, must-revalidate`.
- [ ] 4.5 Open the site in a fresh browser profile, submit a valid invitation code, verify it POSTs to `https://n8n.apps.darideveloper.com/webhook/ourlens/validate` and receives a successful response (no CORS error, no 404).

## 5. Spec Sync
- [ ] 5.1 After deployment is verified stable for 24 hours, archive this change via `openspec archive add-dockerfile-deployment --yes`.
