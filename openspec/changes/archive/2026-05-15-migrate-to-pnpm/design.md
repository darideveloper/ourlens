# Design: npm → pnpm Migration

## Context
The project is a single-package Astro 6 SSG app deployed via Coolify (pre-built Nginx static serving). There is no monorepo, no workspace config, no peer/optional dependencies, and no postinstall hooks. All packages are modern and pnpm-compatible. No GitHub Actions CI exists, so only the local dev script and Coolify dashboard need updating.

## Goals / Non-Goals
- Goals: replace npm as the package manager; generate pnpm-lock.yaml; keep Coolify build working
- Non-Goals: changing Nginx config, touching application source code, adding monorepo structure

## Decisions

### Decision: Use Corepack for pnpm activation (preferred over global install)
Node 22 ships with Corepack. Setting `"packageManager": "pnpm@X.Y.Z"` in `package.json` activates Corepack auto-detection — no manual `npm install -g pnpm` needed in Coolify or locally. The exact pnpm version is pinned for reproducibility.

- **Alternative considered**: `npm install -g pnpm` as a Coolify pre-install command. Works, but couples the version to the Coolify environment rather than the repo.
- **Chosen**: Corepack — version-pinned in repo, zero Coolify env config required.

> Prerequisite: run `corepack enable` once locally (or `npm install -g pnpm` as fallback if Corepack is unavailable in the Coolify build image).

### Decision: Coolify build command changes are out-of-band (dashboard only)
Coolify doesn't read a repo config file for its build commands; they live in the Coolify project settings. Required changes:

| Setting | Current | New |
|---|---|---|
| Install command | `npm install` (or blank) | `pnpm install` |
| Build command | `npm run build` | `pnpm build` |

The build output directory (`dist/`) and Nginx config are unchanged.

### Decision: `dev.sh` uses `pnpm astro dev` (not `pnpm run dev`)
`pnpm astro dev` calls the `astro` binary directly via pnpm's bin resolution, identical to how `npx astro dev` worked. This aligns with the existing script idiom and avoids an intermediate `package.json` script indirection.

## Risks / Trade-offs
- **Corepack not enabled on Coolify build image**: Low risk — Node 22 includes Corepack. Fallback: add `npm install -g pnpm@X.Y.Z` to Coolify pre-install command.
- **pnpm strict hoisting breaks an import**: Near-zero risk — no direct `node_modules/` path imports exist and no phantom dependency patterns were found across all source files.
- **pnpm-lock.yaml committed to repo**: Expected — this is the pnpm equivalent of `package-lock.json` and should be version-controlled.

## Migration Plan
1. `corepack enable` (once, locally)
2. Add `"packageManager": "pnpm@X.Y.Z"` to `package.json`
3. `rm package-lock.json`
4. `pnpm install` → generates `pnpm-lock.yaml`
5. `pnpm build` → verify identical `dist/` output
6. `pnpm dev` → verify dev server starts
7. Edit `dev.sh` line 32
8. Commit: delete `package-lock.json`, add `pnpm-lock.yaml`, update `package.json` + `dev.sh`
9. Update Coolify dashboard (install + build commands)
10. Trigger Coolify redeploy; verify site loads at `https://ourlens.darideveloper.com`

## Open Questions
- None — all dependencies confirmed pnpm-compatible; Coolify build image includes Node 22 + Corepack.
