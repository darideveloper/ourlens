## 1. Rewrite timeout + signal logic in `attemptFetch`

- [x] 1.1 Replace `AbortSignal.any()` / `AbortSignal.timeout()` on lines 17-19 with a manual `AbortController` + `setTimeout` approach that handles all four scenarios: external signal provided + abort, external signal pre-aborted, no external signal, and fetch completes before timeout
- [x] 1.2 Add `clearTimeout` calls so the timer is always cleaned up after the fetch settles (success, error, or abort)
- [x] 1.3 Verify that `FetchError('timeout')` is still thrown when the timeout fires and `FetchError('abort')` when the external signal aborts — error names (`TimeoutError`, `AbortError`) must match the existing `DOMException.name` checks on lines 25-29
- [x] 1.4 Test on an iOS 15.x simulator or device (e.g., via Playwright emulation or BrowserStack) to confirm the fix works — the verify step at task 2.2 catches the symptom, this catches the actual fix on target hardware

## 2. Verify with build

- [x] 2.1 Run `pnpm build` (or `astro build`) and confirm there are no type errors, since `client.ts` exports types used across the API layer
- [x] 2.2 Confirm the built bundle does not contain `AbortSignal.any` or `AbortSignal.timeout` calls — grep the `dist/` output to verify they're fully replaced
