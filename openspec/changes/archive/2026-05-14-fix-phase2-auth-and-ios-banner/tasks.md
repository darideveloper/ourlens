## 1. Fix IosInstallBanner crash

- [x] 1.1 Fix function call typo in `src/components/atoms/IosInstallBanner.tsx:17` — change `isiOSPwa()` to `isIOSPwa()` to match the function definition on line 5
- [x] 1.2 Playwright test: navigate to `/instructions` and verify no console errors reference `ReferenceError: isiOSPwa is not defined`

## 2. Fix AuthGuard infinite spinner for unauthenticated users

- [x] 2.1 Update `useHydratedSessionStore` in `src/stores/use-session-store.ts` — after hydration completes, if no `isValid` value exists in localStorage (first visit / incognito), resolve `isValid` to `false` instead of leaving it as `null`. This ensures `AuthGuard` can distinguish "hydrating" from "not authenticated."
- [x] 2.2 Update `AuthGuard.tsx` if needed — verify the existing logic still works: `isValid === null` shows spinner (hydration pending), `isValid === false` redirects to `/`, `isValid === true` renders children
- [x] 2.3 Playwright test: clear localStorage, navigate to `/instructions`, verify redirect to `/` occurs (no permanent spinner)
- [x] 2.4 Playwright test: clear localStorage, navigate to `/scanner`, verify redirect to `/` occurs
- [x] 2.5 Playwright test: enter a valid invitation code on `/`, verify navigation to `/instructions` succeeds and protected content is visible

## 3. Fix OfflineIndicator always-visible SSR bug

- [x] 3.1 Update `OfflineIndicator.tsx` — move `navigator.onLine` check into `useEffect`: change initial state from `useState(typeof navigator !== 'undefined' ? !navigator.onLine : false)` to `useState(false)`, and add `setOffline(!navigator.onLine)` as the first line of the `useEffect` callback. This avoids the SSR hydration mismatch where Node.js `navigator.onLine` is `undefined` (causing `!undefined === true`) and ensures the banner is only shown when the browser actually reports offline status.
- [x] 3.2 Playwright test: navigate to `/` and verify the "You are offline" banner is NOT visible when the browser is online
