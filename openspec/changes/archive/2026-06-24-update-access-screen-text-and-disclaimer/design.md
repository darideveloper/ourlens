## Context

The Access Control screen (`src/components/organisms/AccessControl.tsx`) currently shows a single tagline paragraph below the "Welcome to Ourlens" heading. The consent area (rendered by `CodeForm` in `src/components/molecules/CodeForm.tsx`) shows an invitation-code input and a single consent checkbox with a label that links to the external T&C. Both copy elements need to be updated to:

1. Broaden the product positioning (drop "home" — the scanner is general).
2. Set user expectations about scope (educational, not professional) and data handling (local processing, not stored) **before** they accept the terms.

No new state, no new dependencies, no routing changes — this is a copy + minor visual-treatment change in two existing React components.

## Goals / Non-Goals

**Goals:**
- Update the tagline copy to `AI-powered safety scanner for peace of mind.`
- Render a disclaimer paragraph immediately after the consent checkbox.
- Style the disclaimer as secondary text (smaller, muted color, generous spacing) so it does not visually compete with the consent prompt or the submit button.
- Keep the disclaimer outside the `<label>` so the checkbox's accessible name stays as the T&C sentence.
- Preserve all existing accessibility, form, and validation behavior.

**Non-Goals:**
- No changes to the T&C link, the checkbox behavior, or the `termsAccepted` flow.
- No new i18n / localization (the app is English-only).
- No changes to the PWA `<meta name="description">` or any other marketing copy outside the two touched components.
- No changes to the `astro.config.mjs` site description.
- No new design tokens — use existing utility classes.

## Decisions

**Decision 1 — Edit `AccessControl.tsx` in place.**
- Rationale: the tagline is a single literal string; no logic depends on it, and the surrounding JSX structure stays identical. Inline edit is the lowest-risk option.
- Alternatives considered:
  - Extract tagline to a `src/copy/` module — rejected for this PR; the value is used in exactly one place and over-abstracting adds churn. Can be revisited if more copy moves into a shared module later.

**Decision 2 — Add a `<p>` element after the checkbox `<label>` inside the same `<form>`, not a new component.**
- Rationale: keeps the change scoped to one file; the disclaimer is purely presentational and tightly coupled to the consent interaction (it explains the consequences of consenting). A dedicated `Disclaimer` component would be premature.
- Alternatives considered:
  - Wrap the disclaimer in a new `<Disclaimer />` molecule — rejected; the text is only ever used here and contains no logic.
  - Place the disclaimer in `AccessControl.tsx` above the form — rejected; the disclaimer logically follows the consent action it qualifies, and showing it on a separate visual block weakens the connection.

**Decision 3 — Use utility classes only (no CSS module / global rule).**
- Classes: `mt-2 text-sm leading-relaxed text-on-surface-muted/80 px-1` (or similar; final selection at implementation time to match surrounding rhythm).
- Rationale: matches the existing Tailwind utility-first convention in `CodeForm.tsx` (`text-base text-on-surface-muted leading-relaxed select-none`).
- Alternatives considered:
  - Add a global class in `global.css` — rejected; one-off usage does not justify a new design token.

**Decision 4 — Keep the trademark symbol `™` as a literal Unicode character.**
- Rationale: source copy uses `OurLens™`; the file is `.tsx` (JSX), which supports raw `™` inside text nodes. No escape needed.
- Alternatives considered:
  - HTML entity `&trade;` — rejected; JSX text nodes render Unicode fine, and `&trade;` would show literally in the rendered text if the surrounding context is treated as a string (e.g., a copy-paste of the file).

**Decision 5 — Do not link or otherwise decorate "OurLens™".**
- Rationale: the disclaimer is body copy, not a navigation surface. Adding a link would imply a separate legal entity page that does not exist.

## Risks / Trade-offs

- [Risk] Trademarks: rendering `™` on a public page can imply a registered trademark that has not actually been filed. → Mitigation: keep the literal as provided by the requester; legal/brand owners can decide later whether to upgrade to `®` or drop the mark.
- [Risk] Disclaimer placement under the checkbox could be misread by screen readers as part of the consent label. → Mitigation: render the disclaimer as a sibling `<p>` *outside* the `<label>` element. The checkbox's accessible name remains the existing T&C sentence.
- [Risk] Visual clutter: a wall of text directly under the checkbox could distract from the primary action ("Verify Code"). → Mitigation: use a small, muted text style with a small top margin and a max-width matching the form (`max-w-sm`).
- [Risk] Translations drift: the rest of the app is English-only, so no current i18n impact, but a future localization pass must include both the tagline and the disclaimer. → Mitigation: leave a comment-free reminder in the design doc (this file) — not in source.

## Migration Plan

- Single PR, no feature flag.
- Deploy: ship behind the existing static build; users see the new copy on next page load. No service worker migration needed (the SW caches the HTML shell, but a new version is picked up on next activation as usual).
- Rollback: revert the two files (`AccessControl.tsx`, `CodeForm.tsx`).

## Open Questions

- None blocking. Optional follow-up: should the same disclaimer be mirrored on the instructions or report screens? Out of scope for this change; the request only covers the access screen.
