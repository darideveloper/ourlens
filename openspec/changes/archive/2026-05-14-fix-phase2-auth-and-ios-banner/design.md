## Context

Phase 2 of the Ourlens PWA introduced `AuthGuard` for route protection, `IosInstallBanner` for iOS PWA install prompts, and `OfflineIndicator` for network status. Three bugs prevent correct behavior:

1. IosInstallBanner crashes with a `ReferenceError` due to a function name case mismatch.
2. AuthGuard shows a permanent spinner for unauthenticated users because Zustand's `isValid` remains `null` after hydration with no stored session data.
3. OfflineIndicator shows a permanent "You are offline" banner because of an SSR/client hydration mismatch caused by Node.js 18+ defining `navigator` as a global object where `navigator.onLine` is `undefined` (not `true`).

## Decisions

### AuthGuard hydration state tri-state resolution

**Problem:** `isValid` in the session store has three conceptual states:

| State | Meaning | AuthGuard behavior |
|---|---|---|
| `null` | Hydration pending — localStorage not yet read | Show spinner |
| `false` | Hydrated, no valid session | Redirect to `/` |
| `true` | Hydrated, valid session | Render children |

The current `useHydratedSessionStore` hook returns `isValid: null` before hydration AND after hydration when localStorage has no stored `ourlens-session` key. After hydration completes with empty localStorage, the store's initial values (`isValid: null`) remain unchanged because there's nothing in localStorage to override them.

**Decision:** In `useHydratedSessionStore`, after the `onFinishHydration` callback fires, check whether `isValid` is still `null`. If so, set it to `false` explicitly, since hydration has completed and no stored session was found. This makes `null` truly mean "hydrating" and `false` truly mean "not authenticated."

```ts
export function useHydratedSessionStore() {
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    useSessionStore.persist.rehydrate();
    const unsub = useSessionStore.persist.onFinishHydration(() => {
      // After hydration, if no stored session exists, isValid is still null.
      // Resolve to false so AuthGuard can redirect unauthenticated users.
      if (useSessionStore.getState().isValid === null) {
        useSessionStore.setState({ isValid: false });
      }
      setHydrated(true);
    });
    if (useSessionStore.persist.hasHydrated()) {
      if (useSessionStore.getState().isValid === null) {
        useSessionStore.setState({ isValid: false });
      }
      setHydrated(true);
    }
    return unsub;
  }, []);

  const store = useSessionStore();
  return hydrated ? store : { ...store, code: '', isValid: null };
}
```

**Alternatives considered:**
- Change the store initial value of `isValid` to `false` — this would cause a flash of redirect on every page load during hydration, since `false` would trigger `navigate('/')` before localStorage is read.
- Use a separate `isHydrated` flag in AuthGuard — adds complexity and still needs the store to distinguish unauthenticated state.
- Use Astro middleware — cannot read client-side localStorage, so this approach is not viable.

### IosInstallBanner function name fix

**Problem:** `isIOSPwa` is defined with capital `I` but called as `isiOSPwa` with lowercase `i`.

**Decision:** Change the call on line 17 to match the definition: `isiOSPwa()` → `isIOSPwa()`. No other changes needed.

### OfflineIndicator SSR hydration mismatch

**Problem:** The `OfflineIndicator` component initializes state with:
```tsx
const [offline, setOffline] = useState(
  typeof navigator !== 'undefined' ? !navigator.onLine : false,
);
```

In Node.js 18+, `navigator` is a defined global object (type `"object"`), but `navigator.onLine` is `undefined` (Node doesn't track browser network status). This causes:
- **SSR:** `typeof navigator !== 'undefined'` is `true`, `navigator.onLine` is `undefined`, `!undefined` is `true` → `offline = true` → banner rendered in server HTML
- **Client:** `navigator.onLine` is `true` (browser is online), `!true` is `false` → `offline = false` → banner should be hidden
- **Result:** The SSR HTML contains the visible banner. React's hydration reconciliation keeps the SSR-rendered DOM, and the `useEffect` event listeners only fire on `offline`/`online` events, never re-evaluating the initial state. The banner remains permanently visible.

**Decision:** Move the `navigator.onLine` check entirely into `useEffect` and always initialize `offline` to `false`. This ensures:
- **SSR:** `offline = false` → banner hidden (no SSR rendering)
- **Client:** `useEffect` sets `setOffline(!navigator.onLine)` immediately on mount → correct state
- **Result:** SSR and client initial states match (`false`), no hydration mismatch, and the banner only appears when the browser actually reports offline status.

```tsx
export default function OfflineIndicator() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    // ...event listeners
  }, []);
  // ...
}
```

**Alternatives considered:**
- Guard the initial state with `typeof navigator.onLine === 'boolean'` — works but is less clean; the intent ("hidden by default until we know the real state") is clearer with `useState(false)`.
- Use `client:only="react"` on the component — overkill; the component doesn't need to skip SSR entirely, it just needs a consistent initial state.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Setting `isValid: false` after hydration could conflict with an ongoing `validateCodeAction` | The `isValid: false` fallback only triggers when hydration completes and no stored value exists. If `validateCodeAction` is in progress, `isValidating: true` will be set, and hydration will find no stored `isValid`, so `false` is correct — the redirect will occur, and the user can re-enter their code. |
| Edge case: user navigates to protected route while validation is in-flight on `/` | AuthGuard on the protected route reads from a separate component mount. If validation completes on `/` first, `isValid: true` will be persisted, and the protected route's hydration will find it. If the user navigates before validation completes, redirecting to `/` is the correct behavior. |
| Brief flash of hidden OfflineIndicator on mount before useEffect fires | The `useEffect` fires synchronously after the first render on the client, so the flash is imperceptible (one frame at most). This is preferable to permanently showing a false "offline" banner. |

## Open Questions

None — all three fixes are straightforward corrections of Phase 2 implementation bugs.