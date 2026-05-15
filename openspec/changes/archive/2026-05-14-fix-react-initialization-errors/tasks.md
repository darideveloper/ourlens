## 1. Diagnose Root Cause

- [x] 1.1 Stop any running `astro dev` process
- [x] 1.2 Clear Vite dependency cache: `rm -rf node_modules/.vite`
- [x] 1.3 Confirm cache clear alone does not fix errors (errors persisted in browser after restart)
- [x] 1.4 Check for duplicate React via `npm ls react` — confirmed single deduped version at npm level
- [x] 1.5 Identify actual cause: `virtual:pwa-register/react` (from `@vite-pwa/astro`) resolves React via its own path, creating a second instance in Vite's module graph separate from `@astrojs/react`'s pre-bundled copy

## 2. Apply Fix

- [x] 2.1 Add `resolve.dedupe: ['react', 'react-dom']` to Vite config in `astro.config.mjs` — forces Rollup to collapse both React resolution paths into one
- [x] 2.2 Add `optimizeDeps.include: ['react', 'react-dom']` to Vite config — ensures React is pre-bundled before virtual PWA module resolves its own copy
- [x] 2.3 Add `"vite-pwa-assets-generator.config.ts"` to `exclude` in `tsconfig.json` — prevents Astro's TS processing from picking up the PWA assets config file

## 3. Add Build Cache Cleaning Script

- [x] 3.1 Add `"dev:clean": "rm -rf node_modules/.vite && astro dev"` script to `package.json`

## 4. Verify Fix

- [x] 4.1 Run `astro build` — 5 pages built, zero errors
- [x] 4.2 Confirmed `Re-optimizing dependencies because vite config has changed` logged on next build, showing Vite picked up the new dedupe config
