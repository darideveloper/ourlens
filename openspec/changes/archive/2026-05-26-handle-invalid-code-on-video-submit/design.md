## Context

When a user records and submits a video for analysis via the camera scanner, the application makes a POST request to `/analyze`. If the user's invitation code has expired or is invalid, the API returns `[ { "valid": false } ]`. Currently, the frontend parses this as a successful response, logs a parsing warning, and falls back to rendering a mock low-risk hazard card on the report screen. This keeps the user in an invalid session state without alerting them to the actual expiration/invalidation of their code.

## Goals / Non-Goals

**Goals:**
- Detect the `[ { "valid": false } ]` payload from the `/analyze` API call.
- Raise a specific `FetchError` of type `http` and status `401` when this payload is received.
- Intercept the 401 error inside the video submission hook `useAnalysis`.
- Prompt the user with a blocking `window.alert` informing them of the session expiration.
- Reset the Zustand session store (clearing `code` and setting `isValid: false`), which automatically clears it from localStorage via Zustand's persist middleware.
- Redirect the user back to the initial login screen `/` using history replacement.

**Non-Goals:**
- Modifying the backend API response format.
- Adding complex modal components; a standard `window.alert` provides the simplest, most reliable blocking notification required by the prompt.

## Decisions

### 1. Intercepting the invalid code payload in the API layer
We will update `parseSafetyReport` in `src/lib/api/analyze-frames.ts` to detect the `[ { "valid": false } ]` structure.
- **Why**: Intercepting it at the parsing/API layer allows us to translate a `200 OK` response with an error payload into a standard `FetchError` with status code `401` (Unauthorized/Expired).
- **Alternative considered**: Handling it directly in the react hook. This would split the parsing logic across different files and pollute the hook with payload format checks.

### 2. Utilizing `FetchError` with status 401
We will throw `new FetchError('http', 'Session expired', 401)` when the invalid code response is detected.
- **Why**: Reusing the existing `FetchError` class from `src/lib/api/client.ts` avoids creating new error classes and keeps error handling uniform.

### 3. Invalidation & Navigation in `useAnalysis`
Inside the catch block of the `analyze` function in `src/hooks/useAnalysis.ts`:
- Check if the error is a `FetchError` with status `401`.
- If so:
  1. Call `reset()` to restore the `useAnalysisStore` to `idle`.
  2. Show `window.alert('Session Expired: Your invitation code is invalid or has expired. Please verify your code again.')`.
  3. Reset the session store via `useSessionStore.getState().reset()` and set `isValid: false` to clear `localStorage` via its persist middleware.
  4. Reset in-memory camera state (`useCameraStore.getState().reset()`) and clear the current scan state (`useScanStore.getState().clearCurrentScan()`) to avoid any leaking state from the expired session.
  5. Call `navigate('/', { history: 'replace' })` to redirect the user.
- **Why**: Performing this in `useAnalysis` ensures all progress spinners, overlays, in-memory states (camera frames, current scan), and credentials are fully cleared, and the user is redirected cleanly without rendering intermediate report screens.

## Risks / Trade-offs

- **[Risk]** The user could navigate back using the browser's back button.
  - *Mitigation*: The `AuthGuard` protecting routes check `isValid`. Since the session store was reset and `isValid` is now `false`, any attempt to visit a protected route (`/scanner`, `/instructions`, `/report`) will automatically redirect the user back to `/`.
