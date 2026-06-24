## 1. Update Access Control tagline

- [x] 1.1 In `src/components/organisms/AccessControl.tsx`, replace the tagline paragraph text `AI-powered home safety scanner for peace of mind.` with `AI-powered safety scanner for peace of mind.`
- [x] 1.2 Keep the existing paragraph element, classes, and surrounding JSX structure unchanged (only the literal text inside the `<p>` changes).

## 2. Add disclaimer below the consent checkbox

- [x] 2.1 In `src/components/molecules/CodeForm.tsx`, add a new `<p>` element directly after the closing `</label>` of the consent checkbox and before the submit `<button>`.
- [x] 2.2 The new `<p>` SHALL contain the exact text: `OurLens™ is an educational hazard-awareness tool and is not a substitute for professional advice, safety assessments, or regulatory compliance reviews. Data is processed locally on your device and is not stored by OurLens.`
- [x] 2.3 Apply Tailwind utility classes that visually demote the disclaimer: `mt-2 text-sm leading-relaxed text-on-surface-muted/80` (or equivalent tokens that match the existing rhythm of the form — confirm visually before merging).
- [x] 2.4 Verify the new `<p>` is rendered as a sibling of the `<label>` (not nested inside it) so the checkbox accessible name remains the T&C sentence.

## 3. Verify

- [x] 3.1 Run `npm run build` and confirm no type or lint errors.
- [x] 3.2 Verified via built `dist/index.html`:
  - [x] 3.2.1 Tagline reads `AI-powered safety scanner for peace of mind.` (no `home`).
  - [x] 3.2.2 Disclaimer `<p>` is rendered between the `<label>` (checkbox) and the submit `<button>`.
  - [x] 3.2.3 Disclaimer uses `text-sm leading-relaxed text-on-surface-muted/80` — smaller and more muted than the consent label.
  - [x] 3.2.4 "Verify Code" button keeps `disabled=""` in SSR output (still gated by `inputValue && checked`).
  - [x] 3.2.5 Disclaimer is a plain `<p>` (no `tabindex`), not focusable.
- [x] 3.3 Run the OpenSpec validation: `openspec validate update-access-screen-text-and-disclaimer --strict` — passed.
- [x] 3.4 Playwright suite exists at `tests/e2e/`. Installed Chromium and ran `auth-and-banner.spec.ts` — 6/7 passed. The 1 failure (`Task 2.5 - … see protected content`) is a pre-existing failure on `main` (verified via `git stash`) caused by the n8n backend not accepting the test invite code `OURLENS` in this environment; not a regression from this change.
