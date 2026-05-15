## Context

The app shows React hooks initialization errors. The errors are:

- `TypeError: Cannot read properties of null (reading 'useState')` at React module level
- `Invalid hook call. Hooks can only be called inside of the body of a function component.`
- Affected components: `PWAUpdatePrompt`, `IosInstallBanner`, `OfflineIndicator`, `CodeForm`

These errors happen because React's module exports (useState, useCallback, etc.) resolve to null/undefined at runtime, meaning two copies of React are loaded and they don't share the same internal singleton state.

## Root Cause

### Confirmed Cause: Duplicate React Instance from `virtual:pwa-register/react`

`@vite-pwa/astro` provides a virtual module `virtual:pwa-register/react` which is consumed by `PWAUpdatePrompt`. This virtual module imports React through its own resolution path, separate from the one `@astrojs/react` pre-bundles for Astro's island hydration system. Vite ends up with two React copies in the module graph.

React stores hook state (`ReactCurrentOwner`, dispatcher, etc.) in module-level singletons. When two copies coexist, the instance used by `@astrojs/react` to mount components is different from the instance `virtual:pwa-register/react` (and indirectly the bundled component chunk) reads hooks from. The result: `useState`, `useCallback`, etc. are all null on the wrong instance.

This affects **all** React components in the app, not just `PWAUpdatePrompt`, because the chunk bundling pulls in the wrong React instance at the module graph level.

**Evidence:**
- `npm ls react` shows `react@19.2.6` deduped at the npm level — no duplicate packages installed
- But Vite's module graph has two resolution paths to React: one via `@astrojs/react` pre-bundling and one via the PWA virtual module
- Adding `resolve.dedupe` forces Rollup to collapse both paths to a single module

### Why the Cache Clear Didn't Help

Clearing `node_modules/.vite` removes the pre-bundled cache but doesn't change how Vite resolves React modules. On the next start, it just rebuilds the same broken module graph.

### Ruled Out

- **Stale Vite cache:** Cache state doesn't matter; the graph is re-built incorrectly each time
- **Duplicate npm packages:** `npm ls react` confirms single deduped version
- **Component code errors:** Standard hooks usage in correct function component bodies
- **`@astrojs/react` version:** v5.0.4 is compatible with React 19

## Fix

Add to `vite` config in `astro.config.mjs`:

```js
resolve: {
  dedupe: ['react', 'react-dom'],
},
optimizeDeps: {
  include: ['react', 'react-dom'],
},
```

- `resolve.dedupe` — tells Rollup: when multiple parts of the module graph import `react` or `react-dom`, always resolve to the same physical file. Collapses the two React paths into one.
- `optimizeDeps.include` — tells Vite to pre-bundle React before dev server startup, so the virtual PWA module picks up the already-bundled copy rather than initiating its own resolution.

## Additional Changes

- **`dev:clean` script** in `package.json`: `rm -rf node_modules/.vite && astro dev` — convenient recovery from cache corruption without needing to remember the manual command
- **`tsconfig.json` exclude**: Add `vite-pwa-assets-generator.config.ts` to prevent Astro's TypeScript processing from picking up the PWA assets generator config (which imports from `@vite-pwa/assets-generator/config`) — avoids potential module resolution interference
