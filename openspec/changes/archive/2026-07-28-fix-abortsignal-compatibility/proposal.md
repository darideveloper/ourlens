## Why

`AbortSignal.any()` crashes on iOS < 16.4 with `"AbortSignal.any is not a function"`. `AbortSignal.timeout()` also requires iOS 15.6+. Both are used in `safeFetch()` — the API client that powers all backend communication. This blocks users on devices running iOS 15.5 or earlier (e.g., iPhone 11/8 on older OS versions that still support the app's camera features).

## What Changes

- Replace `AbortSignal.any()` + `AbortSignal.timeout()` in `src/lib/api/client.ts` with a manual `AbortController` + `setTimeout` approach
- Preserve all existing error classification (`TimeoutError`, `AbortError`, `network`, `http`, `parse`)
- Preserve retry logic, signal forwarding from callers (`useAnalysis`), and timeout limits (30s/60s)
- No new dependencies, no polyfill libraries

## Capabilities

### New Capabilities
*(none — no new capabilities introduced)*

### Modified Capabilities
- `api-integration`: The `AbortSignal.timeout()` requirement is replaced with a manually implemented timeout that works on iOS 12.2+ without relying on modern `AbortSignal` static methods

## Impact

- **One file changed**: `src/lib/api/client.ts` — the `attemptFetch` function
- **Callers unaffected**: `analyze-frames.ts` (links user's `AbortController` via `options.signal`) and `validate-code.ts` (no signal at all) both work without changes; no API changes
- **Error contract unchanged**: `FetchError('timeout')`, `FetchError('abort')` thrown identically
- **Zero new dependencies**: Uses `AbortController` (iOS 12.2+), `setTimeout`, and `clearTimeout` only
