# Change: Expand Invitation Code Input to Accept Any Character

## Why
The invitation code input in `CodeForm.tsx` carries `inputMode="numeric"`, which forces a numeric-only keyboard on mobile devices and implies that only digits are accepted. The n8n backend stores codes as opaque strings with no character restriction — if the backend ever issues an alphanumeric code (e.g., `HOME2024` or `OURLENS-A1`), the current UI makes it difficult or impossible for users to enter it. Removing the numeric keyboard hint and updating the placeholder aligns the input with what the system actually supports.

## What Changes
- Remove `inputMode="numeric"` from the invitation-code `<input>` in `CodeForm.tsx` — the default full keyboard is shown instead.
- Update the placeholder from `"e.g. 4821…"` to `"Your code…"` — eliminates the implied numeric constraint without adding new visual noise.
- Update the e2e test in `auth-and-banner.spec.ts` to use an alphanumeric test code (`"OURLENS"`) so the test actually exercises the new input behaviour.
- Update the `access-control` spec delta to reflect that `inputMode` is no longer set and the placeholder no longer implies digits only.

## Impact
- Affected specs: `access-control`
- Affected code:
  - `src/components/molecules/CodeForm.tsx` — remove `inputMode="numeric"`, update `placeholder`
  - `tests/e2e/auth-and-banner.spec.ts` — update test code string
- No backend, store, API type, or routing changes required — `code` is already typed as `string` throughout the stack.
- No breaking changes to any persisted state or API contract.
