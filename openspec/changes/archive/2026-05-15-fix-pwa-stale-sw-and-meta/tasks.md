## 0. Immediate Workaround for Affected Users (no code change)
- [x] 0.1 Instruct currently affected users to clear the stale SW: browser Settings → Site Settings → ourlens.apps.darideveloper.com → Clear & Reset (or DevTools → Application → Service Workers → Unregister + hard reload)
- [x] 0.2 Force a clean redeploy on Coolify so the server serves only new-hash assets — clearing any Docker layer cache if needed

## 1. Service Worker Auto-Update
- [x] 1.1 Change `registerType: 'prompt'` to `registerType: 'autoUpdate'` in `astro.config.mjs`
- [x] 1.2 Remove `PWAUpdatePrompt` import and usage from `src/layouts/Layout.astro`
- [x] 1.3 Delete `src/components/atoms/PWAUpdatePrompt.tsx`

## 2. Deprecated Meta Tag
- [x] 2.1 Replace `apple-mobile-web-app-capable` with `mobile-web-app-capable` in `src/layouts/Layout.astro`

## 3. Validation
- [x] 3.1 Run `pnpm build` and confirm no TypeScript errors — ✓ built in 8.20s, 5 pages, no errors
- [ ] 3.2 Open the built app in a browser and verify no console warnings about the deprecated meta tag
- [ ] 3.3 Verify the PWA update prompt no longer appears on the page
- [ ] 3.4 Confirm the service worker registers and the app loads correctly offline
