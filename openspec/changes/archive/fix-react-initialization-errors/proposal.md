# Change: Fix React Initialization Errors

## Why

After implementing the PWA branding changes, the app throws `TypeError: Cannot read properties of null (reading 'useState')` at the React module level, plus repeated `Invalid hook call` errors. All React islands (PWAUpdatePrompt, IosInstallBanner, OfflineIndicator, CodeForm) fail to hydrate, making the app completely non-functional.

The root cause is that `virtual:pwa-register/react` (provided by `@vite-pwa/astro`) resolves React through its own module path, creating a second React instance alongside the one Astro pre-bundles via `@astrojs/react`. Since React stores hook state in module-level singletons, two instances means hooks always fail — `useState`, `useCallback`, etc. resolve to `null`.

## What Changes

- Add `resolve.dedupe: ['react', 'react-dom']` to the Vite config in `astro.config.mjs` to force Rollup to use exactly one copy of React regardless of how many places import it
- Add `optimizeDeps.include: ['react', 'react-dom']` to ensure Vite pre-bundles React before any virtual modules can load their own copy
- Add a `dev:clean` npm script that clears Vite cache before starting the dev server, as a convenience for recovering from cache corruption
- Exclude `vite-pwa-assets-generator.config.ts` from `tsconfig.json` to prevent Astro's TypeScript processing from picking up the PWA assets config file

## Impact

- Affected specs: `dev-tooling`
- Affected code: `astro.config.mjs` (Vite dedupe + optimizeDeps), `package.json` (new script), `tsconfig.json` (exclude)
- No code changes to React components or source files needed
