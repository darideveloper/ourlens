# Change: Fix Phase 2 AuthGuard infinite spinner, iOS banner crash, and OfflineIndicator SSR bug

## Why

Three bugs from the Phase 2 implementation prevent the app from working correctly for unauthenticated users, crash on every page load, and show a false "You are offline" banner at all times:

1. **AuthGuard infinite spinner (Critical):** When a user without a valid session (no localStorage data, e.g. private/incognito window or first visit) navigates to a protected route (`/instructions`, `/scanner`, `/report`), the `AuthGuard` component shows a permanent loading spinner and never redirects to `/`. The root cause is that Zustand's `isValid` state is `null` both before hydration and after hydration with no stored session data. The `AuthGuard` cannot distinguish "hydration pending" from "not authenticated," so its `isValid === null` branch is always hit, trapping the user on a spinner forever.

2. **IosInstallBanner crash (High):** The `isIOSPwa` function is defined with capital `I` (`isIOSPwa`) on line 5 of `IosInstallBanner.tsx`, but called with lowercase `i` (`isiOSPwa`) on line 17. JavaScript is case-sensitive, so this `ReferenceError` crashes the `<IosInstallBanner>` component on every page render, preventing the iOS install prompt from ever being shown.

3. **OfflineIndicator always visible (Medium):** The `OfflineIndicator` component initializes its `offline` state with `useState(typeof navigator !== 'undefined' ? !navigator.onLine : false)`. In Node.js 18+, `navigator` is a defined global object (type `"object"`), but `navigator.onLine` is `undefined` (Node doesn't track browser network status). Since `!undefined` evaluates to `true`, the initial state is `true` during SSR, causing the "You are offline" banner to be rendered into the server HTML. Even after client hydration sets `offline` to `false`, the SSR-rendered banner persists in the DOM, making it permanently visible to users.

## What Changes

- **Fix AuthGuard hydration logic:** Change `useHydratedSessionStore` so that after Zustand persist rehydration completes with no stored session data, `isValid` resolves to `false` (not `null`). This allows `AuthGuard` to reach its redirect branch and send unauthenticated users to `/`.
- **Fix IosInstallBanner typo:** Correct the function call from `isiOSPwa()` to `isIOSPwa()` in `IosInstallBanner.tsx:17`.
- **Fix OfflineIndicator SSR mismatch:** Move the `navigator.onLine` check entirely into `useEffect` so the initial state is always `false` (hidden), avoiding the SSR/client hydration mismatch. The correct offline state is set client-side only after the component mounts.

## Impact

- Affected specs: access-control, pwa-infrastructure
- Affected code:
  - `src/stores/use-session-store.ts` — hydration guard hook logic
  - `src/components/molecules/AuthGuard.tsx` — redirect condition handling
  - `src/components/atoms/IosInstallBanner.tsx` — function name typo
  - `src/components/atoms/OfflineIndicator.tsx` — initial state SSR mismatch