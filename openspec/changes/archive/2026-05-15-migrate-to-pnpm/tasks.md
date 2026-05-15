## 1. Local Environment Setup
- [x] 1.1 Enable Corepack locally: `corepack enable` (skip if pnpm already installed globally)
- [x] 1.2 Verify pnpm version available: `pnpm --version` → 10.18.3

## 2. package.json Update
- [x] 2.1 Add `"packageManager": "pnpm@X.Y.Z"` field to `package.json` with the exact pnpm version from step 1.2 → pinned `pnpm@10.18.3`

## 3. Lockfile Migration
- [x] 3.1 Delete `package-lock.json`
- [x] 3.2 Delete `node_modules/` to ensure a clean install
- [x] 3.3 Run `pnpm install` — verify it completes without errors and generates `pnpm-lock.yaml`
  - Note: added `.npmrc` with `public-hoist-pattern[]=workbox-*` to fix vite-plugin-pwa phantom dep

## 4. Build Verification
- [x] 4.1 Run `pnpm build` — verify `dist/` is generated without errors
- [x] 4.2 Run `pnpm preview` — spot-check the built site loads correctly in browser (manual)

## 5. Dev Server Verification
- [x] 5.1 Run `pnpm dev` — verify Astro dev server starts on port 4321 (HTTP 200 confirmed)

## 6. dev.sh Update
- [x] 6.1 Edit `dev.sh` line 32: replace `npx astro dev --port $PORT` with `pnpm astro dev --port $PORT`
- [x] 6.2 Run `./dev.sh` — verify the tmux session starts correctly with the updated script

## 7. Documentation Update
- [x] 7.1 Update `README.md`: replace all `npm install` → `pnpm install`, `npm run <cmd>` → `pnpm <cmd>`, `npx <cmd>` → `pnpm dlx <cmd>`

## 8. Commit
- [x] 8.1 Stage and commit: delete `package-lock.json`, add `pnpm-lock.yaml`, update `package.json` + `dev.sh` + `README.md`
  - Commit: `82dc9af chore(tooling): migrate package manager from npm to pnpm`

## 9. Coolify Deployment Update (manual — out of repo)
- [x] 9.1 Open Coolify dashboard → project settings for `ourlens`
- [x] 9.2 Update install command: `npm install` → `pnpm install`
- [x] 9.3 Update build command: `npm run build` → `pnpm build`
- [x] 9.4 Save and trigger a manual redeploy
- [x] 9.5 Verify site loads at `https://ourlens.darideveloper.com` after deploy

## 10. Validation
- [x] 10.1 Confirm `pnpm-lock.yaml` is committed and `package-lock.json` is deleted from repo
- [x] 10.2 Confirm `package.json` has `"packageManager"` field → `"pnpm@10.18.3"`
- [x] 10.3 Confirm Coolify deploy succeeded (green deploy log, no install errors) (manual)
