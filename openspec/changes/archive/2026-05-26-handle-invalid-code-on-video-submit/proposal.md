## Why

When a user tries to submit a video for analysis but their invitation code is invalid or has expired, the API (`/analyze`) returns `[ { "valid": false } ]`. Currently, the system misinterprets this response as a successful but unparsable safety report, falling back to a dummy "Analysis Complete" scan page and navigating the user to `/report`. This leaves the user in an invalid session state with confusing scan results.

This proposal aims to explicitly detect the invalid/expired invitation code response during video submission, alert the user, reset the session store, clear the token from local storage, and redirect them to the access control screen (`/`).

## What Changes

- **Explicit Detection of Invalid Invitation Code during Video Submission**: The client API layers will intercept the `[ { "valid": false } ]` response from the `/analyze` endpoint and raise a distinct `InvalidCodeError` or similar exception.
- **Alert and Reset Handler**: The React page/component lifecycle hook that invokes video submission will handle this specific error.
- **Session Reset**: The handler will reset the Zustand session store state (setting `isValid: false`, `code: ''`, and `error: null`).
- **User Notification**: The system will display a clear modal/alert to the user indicating that their invitation code has expired or is invalid.
- **Redirection**: Once the user acknowledges/accepts the alert, the application will redirect the user to the initial access control page (`/`).

## Capabilities

### New Capabilities
<!-- None, we are only modifying existing capabilities -->

### Modified Capabilities
- `api-integration`: Add detection of the `[ { "valid": false } ]` structure in `/analyze` response payload, distinguishing it from general parsing errors and throwing a specialized `FetchError` or custom error indicating an expired/invalid token.
- `access-control`: Add handling of the invalid/expired code error during frame submission to notify the user, invalidate the session in `useSessionStore` (clearing it from localStorage), and navigate them back to the initial screen (`/`).

## Impact

- **Affected Files**:
  - `src/lib/api/analyze-frames.ts` (adding check for `[ { "valid": false } ]` response)
  - `src/hooks/useAnalysis.ts` (catching the specific token invalidation/expiration error)
  - `src/stores/use-session-store.ts` (verifying reset function clearing)
- **APIs**: `/analyze` response structure handling.
- **Testing**: Requires mock/playwright tests to verify the flow when `/analyze` returns invalid code.
