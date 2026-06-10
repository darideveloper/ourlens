## 1. Session Store — Add consent state

- [x] 1.1 Add `termsAccepted: boolean` and `setTermsAccepted` action to `use-session-store.ts` Zustand interface and store
- [x] 1.2 Add `termsAccepted` to the `partialize` function so it persists to localStorage
- [x] 1.3 Update hydration logic in `useHydratedSessionStore` to default `termsAccepted` to `false` (alongside existing `isValid: false` default)

## 2. CodeForm — Add consent checkbox

- [x] 2.1 Add a local `checked` state to `CodeForm.tsx` for the checkbox
- [x] 2.2 Add the checkbox input with label: "By using Ourlens you confirm that you have read and agree to our **terms & conditions**" — bold only on "terms & conditions", linked to `https://ourlivesapp.com/our-lens-terms-and-conditions/` with `target="_blank" rel="noopener noreferrer"`
- [x] 2.3 Update the "Verify Code" button `disabled` logic to require both `inputValue.trim()` AND checkbox checked
- [x] 2.4 On successful validation, set `termsAccepted: true` in the session store before navigating

## 3. AuthGuard — Enforce consent on protected routes

- [x] 3.1 Update `AuthGuard.tsx` to check `termsAccepted === true` alongside `isValid === true` before rendering children; redirect to `/` if consent is missing
