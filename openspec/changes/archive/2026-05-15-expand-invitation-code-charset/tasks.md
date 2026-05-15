## 1. CodeForm input update
- [x] 1.1 `src/components/molecules/CodeForm.tsx`: remove the `inputMode="numeric"` prop from the invitation-code `<input>`
- [x] 1.2 `src/components/molecules/CodeForm.tsx`: change `placeholder` from `"e.g. 4821…"` to `"Your code…"`

## 2. E2E test update
- [x] 2.1 `tests/e2e/auth-and-banner.spec.ts`: change the test code from `'1234'` to `'OURLENS'` (length ≥ 4 satisfies the dummy validator; tests the full keyboard path)

## 3. Validation
- [x] 3.1 Run `openspec validate expand-invitation-code-charset --strict` and confirm no issues
- [x] 3.2 Run the Playwright e2e test with the Playwright CLI to confirm the auth flow still passes end-to-end
- [x] 3.3 Open the app on a mobile device (or DevTools responsive mode) and confirm the full keyboard appears on input focus
