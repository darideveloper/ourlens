# Change: Migrate package manager from npm to pnpm

## Why
npm's flat-hoisting can silently resolve phantom dependencies, and its lockfile is significantly larger and slower to install than pnpm's content-addressable store. pnpm offers faster installs via a global store, stricter dependency isolation, and is fully supported by all current dependencies (Astro 6, React 19, TailwindCSS 4).

## What Changes
- Replace `package-lock.json` with `pnpm-lock.yaml`
- Add `"packageManager": "pnpm@X.Y.Z"` to `package.json` (Corepack-compatible)
- Update `dev.sh` to invoke the dev server via `pnpm` instead of `npx`
- Update Coolify dashboard install/build commands (not repo-tracked, done manually)
- Update `README.md` developer instructions to use pnpm commands
- Update `pwa-infrastructure` spec scenario: `npm run generate-pwa-assets` → `pnpm generate-pwa-assets`

## Impact
- Affected specs: `pwa-infrastructure` (MODIFIED), new `package-management` capability (ADDED)
- Affected code: `package.json`, `dev.sh`
- Affected docs: `README.md`, openspec spec scenarios
- **NOT** affected: Nginx config, static output (`dist/`), Astro config, all source files
- Coolify deployment: requires two command changes in the Coolify dashboard (no repo files change)
- **No breaking changes** to application behavior — this is a toolchain-only change
