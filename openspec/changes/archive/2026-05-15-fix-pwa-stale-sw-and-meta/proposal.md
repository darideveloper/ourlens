# Change: Fix PWA Stale Service Worker and Deprecated Meta Tag

## Why

Three production bugs were identified after deployment, two of which share the same root cause:

1. **CSS 404 (stale service worker)**: After a new deployment, the installed PWA's service worker continued serving cached HTML from the previous build. That HTML referenced old Vite-hashed asset filenames (e.g. `global.DZA0safK.css`) that no longer exist on the server (which now only has `global.BBmuXjD7.css`), causing a 404 for all CSS and JS assets.

2. **Wrong API endpoint called (stale service worker)**: The same stale SW served an old JS bundle that called `/webhook/validate-code` — a path that was renamed to `/validate` in a subsequent commit. Users on the installed PWA were hitting a deleted endpoint.

   Both bugs share the same root cause: `registerType: 'prompt'` leaves the old service worker active until the user manually accepts an update prompt. On a mobile PWA installed to the home screen, this prompt is frequently missed or dismissed.

3. **Deprecated meta tag**: `<meta name="apple-mobile-web-app-capable">` is deprecated in favor of `<meta name="mobile-web-app-capable">`. Browsers log a console warning on every page load.

## What Changes

- Change `registerType` from `'prompt'` to `'autoUpdate'` in `astro.config.mjs` so the service worker updates silently on the next page navigation after a new deployment.
- Remove the `PWAUpdatePrompt` component and its usage in `Layout.astro` — it is only used by `registerType: 'prompt'` and becomes dead code after this change.
- Replace `<meta name="apple-mobile-web-app-capable" content="yes">` with `<meta name="mobile-web-app-capable" content="yes">` in `src/layouts/Layout.astro`.

## Impact

- Affected specs: `pwa-infrastructure`
- Affected code:
  - `astro.config.mjs` — `registerType` value
  - `src/layouts/Layout.astro` — deprecated meta tag + PWAUpdatePrompt usage
  - `src/components/organisms/PWAUpdatePrompt.tsx` — deleted
