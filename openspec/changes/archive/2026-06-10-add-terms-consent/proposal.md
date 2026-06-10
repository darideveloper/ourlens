## Why

The app has no legal consent mechanism. Users can access the AI-powered home safety scanner without ever agreeing to Terms & Conditions or a Privacy Policy. This is a liability risk — especially since the app captures camera imagery and sends it to an external AI backend (n8n). Adding consent acceptance at the access-control gate ensures legal coverage before any data is processed.

## What Changes

- Add a consent checkbox to the CodeForm (first screen) with label: "By using Ourlens you confirm that you have read and agree to our **terms & conditions**"
- Link "terms & conditions" to `https://ourlivesapp.com/our-lens-terms-and-conditions/` (opens in new tab)
- Store `termsAccepted` in the persisted session store
- Disable the "Verify Code" button until the checkbox is checked AND a code is entered
- Gate access to protected routes if terms have not been accepted

## Capabilities

### New Capabilities

- `consent-flow`: User consent to Terms & Conditions during the access-control flow, with acceptance persisted locally in the session store.

### Modified Capabilities

- *(none)*

## Impact

- **`src/components/molecules/CodeForm.tsx`** — add checkbox with the specified label text, link to external URL, update button disabled logic
- **`src/stores/use-session-store.ts`** — add `termsAccepted` field (persisted to localStorage)
- **`src/components/molecules/AuthGuard.tsx`** — check `termsAccepted` alongside `isValid`
