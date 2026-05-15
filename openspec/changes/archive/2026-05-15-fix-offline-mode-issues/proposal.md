# Fix Offline Mode Implementation

## Why

The offline mode in the PWA has a critical bug that prevents the navigation fallback from working. When users navigate to any page while offline, they should see the custom offline page, but instead they see the browser's default offline error. Additionally, there are several medium-priority issues: unused imports, animation direction mismatch with the spec, redundant UI components on the offline page, and an inline onclick attribute that poses a CSP risk.

## What Changes

### Critical Fixes
1. **Add HTML files to Workbox precache** — The `globPatterns` in `astro.config.mjs` excludes `.html` files, so the `/offline/index.html` page is never precached. This breaks the `navigateFallback` functionality entirely. Fix by adding `html` to the glob pattern.

### Medium-Priority Fixes
2. **Remove unused Button import** — `src/pages/offline.astro` imports `Button` from `@/components/atoms/Button.astro` but never uses it. The button is hand-coded inline.
3. **Fix animation direction for OfflineIndicator** — The spec requires a `slide-down` effect from the top, but the current implementation uses `animate-slide-up` (slides from below). Need to create or use a proper slide-down animation.
4. **Simplify offline page layout** — The offline page uses `<Layout>` which includes `OfflineIndicator`, `PWAUpdatePrompt`, and `IosInstallBanner` — all redundant or non-functional when already offline. Should use a minimal layout or conditionally exclude these components.

### Low-Priority Improvements
5. **Fix inline onclick on nav back button** — The back button in `Layout.astro` uses inline `onclick="history.back()"` which is a CSP risk. Should use proper event handling.
6. **Consider content pushdown when banner appears** — When the offline banner appears, it overlays the nav bar without pushing content down. Consider adding margin/padding compensation.

## Impact

- **Affected Specs:** `pwa-infrastructure` (specifically offline status indicator and service worker requirements)
- **Affected Code:**
  - `astro.config.mjs` — globPatterns fix
  - `src/pages/offline.astro` — unused import removal, optional minimal layout
  - `src/components/atoms/OfflineIndicator.tsx` — animation fix
  - `src/layouts/Layout.astro` — optional CSP fix for back button
  - `src/styles/global.css` — may need new slide-down animation

## Risks

- Adding `.html` to globPatterns increases the initial precache size (all HTML pages will be cached at SW install). For this small app (~5 pages), this is negligible.
- The offline page layout change (removing Layout) may lose global styles unless a minimal offline-specific layout is created.