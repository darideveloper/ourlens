## 1. API Logic Update

- [x] 1.1 Update `parseSafetyReport` in `src/lib/api/analyze-frames.ts` to detect `[ { "valid": false } ]` in the API payload response.
- [x] 1.2 Import `FetchError` from `@/lib/api/client` inside `src/lib/api/analyze-frames.ts` if not already imported.
- [x] 1.3 Raise `new FetchError('http', 'Session expired', 401)` when the invalid/expired response is detected in the payload.

## 2. Invalidation & Navigation in Hook

- [x] 2.1 Import `useSessionStore`, `useCameraStore`, and `useScanStore` inside `src/hooks/useAnalysis.ts` if not already imported.
- [x] 2.2 Inside `useAnalysis.ts`'s catch block, identify if the thrown error is a `FetchError` with status code `401`.
- [x] 2.3 Reset the loading states by calling the analysis store's `reset()` function.
- [x] 2.4 Prompt the user with a `window.alert('Session Expired: Your invitation code is invalid or has expired. Please verify your code again.')` call.
- [x] 2.5 Reset the session store state by calling `useSessionStore.getState().reset()` and explicitly setting `isValid` to `false` via `useSessionStore.setState({ isValid: false })` (which clears the localStorage).
- [x] 2.6 Reset `useCameraStore` via `useCameraStore.getState().reset()` and clear the scan state via `useScanStore.getState().clearCurrentScan()`.
- [x] 2.7 Perform history replacement navigation redirecting the user back to the initial login screen (`/`).

## 3. Verification & Testing

- [x] 3.1 Verify locally that submitting frames with an invalid or simulated expired code successfully displays the session expired alert.
- [x] 3.2 Verify that upon accepting the alert, the user is navigated back to `/` and the session token is removed from localStorage.
- [x] 3.3 Verify that navigating to `/instructions` or other protected routes after the alert is accepted redirects the user back to `/` (AuthGuard protection verification).
