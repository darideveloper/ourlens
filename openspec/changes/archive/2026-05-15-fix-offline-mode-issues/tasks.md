## 1. Critical Fixes

- [x] 1.1 Add `html` to globPatterns in `astro.config.mjs` — change `globPatterns: ['**/*.{js,css,woff2,png,svg,jpg,ico}']` to `['**/*.{js,css,woff2,png,svg,jpg,ico,html}']`
- [x] 1.2 Rebuild the PWA (`npm run build`) and verify `/offline/index.html` appears in the precache manifest of `dist/sw.js`
- [x] 1.3 Test offline navigation fallback by serving the built app and simulating offline (use Chrome DevTools Application > Service Workers > "Offline" checkbox)

## 2. Medium-Priority Fixes

### 2.1 Remove unused import
- [x] 2.1.1 Remove the unused `Button` import from `src/pages/offline.astro` line 3

### 2.2 Fix OfflineIndicator animation
- [x] 2.2.1 Create a new CSS animation `slide-down` in `src/styles/global.css` that animates from `transform: translateY(-100%)` to `transform: translateY(0)`
- [x] 2.2.2 Update `OfflineIndicator.tsx` to use the new `animate-slide-down` class instead of `animate-slide-up`

### 2.3 Simplify offline page
- [x] 2.3.1 Create a minimal offline layout (e.g., `src/layouts/OfflineLayout.astro`) that:
  - Has no nav bar (no need for navigation when offline)
  - Has no OfflineIndicator (page already says "You're Offline")
  - Has no PWAUpdatePrompt (can't update while offline)
  - Has no IosInstallBanner (irrelevant when offline)
  - Includes necessary CSS (global styles)
  - Includes the inline retry script
- [x] 2.3.2 Update `src/pages/offline.astro` to use the new minimal layout instead of `Layout`

## 3. Low-Priority Improvements (Optional)

### 3.1 Fix inline onclick CSP issue
- [x] 3.1.1 In `src/layouts/Layout.astro`, replace inline `onclick` attribute with proper event handling:
  - Add a `<script>` tag that attaches the event listener via `addEventListener`
  - Or convert the button to a client-side React island with proper event handling

### 3.2 Content pushdown for offline banner
- [ ] 3.2.1 Optionally, modify the OfflineIndicator to add body margin/padding when visible to prevent content overlay

## 4. Verification

- [x] 4.1 Run `npm run build` and verify successful build
- [x] 4.2 Verify `dist/sw.js` contains `/offline/index.html` in precache (grep for "offline" in the precache entries)
- [x] 4.3 Start a local server and test offline navigation:
  - Serve the built app: `npx serve dist`
  - Open browser DevTools > Application > Service Workers > Check "Offline"
  - Navigate to any route (e.g., `/instructions`)
  - Verify the custom offline page appears
- [x] 4.4 Verify the offline indicator slides from the top (not bottom) when browser goes offline
- [x] 4.5 Verify the offline page has no redundant components (no banner, no update prompt, no iOS banner)