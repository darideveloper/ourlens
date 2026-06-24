## Context

The project is an Astro + React PWA (`ourlens`) for AI-driven home safety scanning. The text shipped to end users is rendered by a small set of React/Astro components and Zustand stores. There is no i18n layer — every user-facing string is a hard-coded literal in the source.

In May 2026, the team assumed a UK audience and ran two changes to migrate user-visible text from American to British English:
- `2026-05-22-uk-spelling-analyse-visible-texts` — moved `Analyze`/`Analyzing`/`analyzes` → `Analyse`/`Analysing`/`analyses` across 3 components, 1 store, 1 E2E test, 2 specs.
- `2026-05-25-update-invitation-code-error-message` — added "or expired" to the Access Control error message and updated the corresponding spec. (Note: the error string already used `recognised` in the prior change.)

The audience has since been re-evaluated and the project is now targeting US-based end users. The British spellings are inconsistent with the actual market and read as foreign to the target audience. This change reverses the two prior changes.

Both prior changes explicitly excluded internal identifiers (function names, type names, file names, store names, hook names, API routes, import paths) from the British migration. Those identifiers were kept American. This change continues that policy: only user-visible strings are touched; identifiers stay American.

## Goals / Non-Goals

**Goals:**
- Revert all user-visible text from British to American English to match the target US audience.
- Keep the change mechanically verifiable: a string-literal find-and-replace is the only viable approach (no i18n layer).
- Update the AI system prompt (deployed via n8n) so the AI's returned hazard text uses American English. This affects what users see in every report.
- Update E2E test selectors in lockstep with the component text they target.
- Update delta specs so the spec-driven workflow records the new exact-text requirements.
- Update `CLIENT_README.md` (delivered to the client) so the documentation matches the UI.
- Update dev docs (`docs/render-mermaid.md`, `docs/n8n-setup-guide.md`) prose references for consistency.
- Mark the two prior archived changes as logically superseded (no file moves — they remain in the archive as historical record).

**Non-Goals:**
- No changes to internal code identifiers (function `analyze`, state literal `'analyzing'`, file `analyze-frames.ts`, API route `/analyze`, type `AnalyzeFramesRequest`).
- No changes to CSS custom-property names (`--color-*` in `src/styles/global.css`).
- No changes to Mermaid syntax keywords (`colour:#fff` in `style …` directives — `colour` is Mermaid's native CSS-like keyword).
- No changes to PWA manifest JSON keys (`background_colour`/`theme_colour` in the example manifest in `docs/diagrams/development-phases.md` — those are illustrative keys from a PWA manifest spec, not project text).
- No changes to Tailwind utility class names (`bg-danger-500`, `text-on-surface`, etc.).
- No changes to HTML/CSS reserved keywords (`color-scheme`, `theme-color`).
- No new i18n / l10n infrastructure.
- No changes to n8n webhook paths (`/analyse` vs `/analyze`) — out of scope, requires coordinated n8n redeploy.
- No changes to the data model, API contracts, state shapes, or build process.
- No rollback of the prior UK changes' commits — they stay in git history and the archive.

## Decisions

### Decision 1: Simple find-and-replace approach
**Why:** Every affected string is a literal in source code. No i18n/l10n layer exists. Direct string replacement is the only viable mechanism.
**Alternatives considered:**
- *Add an i18n library (e.g. `react-intl`, `i18next`)*: Rejected — out of scope; the project doesn't have any localization framework and adding one is a much larger effort.
- *Use a `WORD_MAP` constant in a shared util*: Rejected — would require refactoring all string usages to use the constant; larger blast radius than this change needs.

### Decision 2: Component text and E2E selectors in the same commit
**Why:** The E2E test selectors use `button:has-text("Analyse")` which references the visible button text. They must update together to keep tests green.
**Alternatives considered:**
- *Update tests in a follow-up commit*: Rejected — leaves a window where CI is red, violating the project's "no broken main" policy.

### Decision 3: Update the n8n system prompt to instruct American English
**Why:** The AI's hazard names and recommendations are user-visible content. The system prompt currently instructs British output. To match the new American UI text, the AI's output must also be American.
**Alternatives considered:**
- *Remove the spelling instruction entirely*: Rejected — the AI may default to inconsistent spellings without explicit guidance. American English is the safer default for the US audience.
- *Add a post-processing step to Americanize AI output*: Rejected — over-engineered; the prompt instruction is sufficient.

### Decision 4: Mermaid `colour` syntax stays British
**Why:** `style Node fill:#fff,colour:#fff` is Mermaid's native styling language. The keyword `colour` is part of the Mermaid DSL, not a project-visible string. Changing it would break the diagram rendering.
**Alternatives considered:**
- *Replace `colour` with `color` in Mermaid style directives*: Rejected — Mermaid would no longer recognise the keyword and the styles would silently fail. The 30 rendered PNG diagrams in `docs/diagrams/rendered/` would lose their stroke colours.
- *Replace Mermaid with a different diagramming tool*: Rejected — out of scope.

### Decision 5: Prior UK changes stay in the archive
**Why:** The two archived changes (`2026-05-22-uk-spelling-analyse-visible-texts`, `2026-05-25-update-invitation-code-error-message`) are historical record. The new change doesn't need to delete or overwrite them — it just inverts their effect. Keeping them in the archive preserves the audit trail showing that the team considered British English, decided against it, and reverted.
**Alternatives considered:**
- *Delete the prior archived changes*: Rejected — destroys history; the `openspec archive` flow doesn't support deletion.

### Decision 6: No delta spec for `instructional-home`
**Why:** The active `openspec/specs/instructional-home/spec.md` does not mandate the exact phrase "analyzes your home" — it defines high-level content requirements (steps, CTA, accessibility). Only the component literal in `InstructionalHome.astro:91` contains the British word. Updating the component is a content tweak, not a requirement change.
**Alternatives considered:**
- *Add a delta spec that pins the exact instructional copy*: Rejected — would freeze a level of detail the original spec intentionally left to the implementer.

## Risks / Trade-offs

- **[Test timing]** E2E selectors fail if the button text change deploys before the test update. *Mitigation:* component + test updates land in the same commit; same approach used by the prior UK-spelling change.
- **[n8n prompt deploy drift]** The system prompt change in `docs/n8n-setup-guide.md` only takes effect after the n8n workflow is redeployed with the new prompt. Until then, the AI continues to return British hazard text. *Mitigation:* document the n8n redeploy as a follow-up action item in the proposal; the UI text changes are independently shippable.
- **[Hidden British forms]** A future contribution may re-introduce a British form (e.g. `behaviour` in a comment, `optimise` in a new file). *Mitigation:* include a "search for residual British forms" verification step in `tasks.md` before marking the change complete.
- **[Mermaid diagrams already rendered]** The 30 PNGs in `docs/diagrams/rendered/` were generated from Mermaid blocks that use `colour`. If a future regen is attempted without re-rendering, the diagrams remain visually identical (PNGs don't change), so no action needed now.
- **[CLIENT_README supersession]** The 2 prior UK changes did not touch `CLIENT_README.md`. This change does. There is no archived "before-state" of the README to supersede — we're updating the only version that exists.
- **[Scope creep]** This change touches a wide surface (3 components, 1 store, 1 test, 3 spec deltas, 3 docs, 1 AI prompt). It must be executed as a single coordinated change. *Mitigation:* `tasks.md` is structured as a single linear checklist with per-file verification; do not split into multiple PRs.
- **[No new capabilities, only modifications]** Per the OpenSpec schema, this change introduces no new capabilities — it only modifies the exact-text requirements inside existing capabilities. The `Capabilities → New Capabilities` section is intentionally empty.

## Migration Plan

1. Apply the change as a single commit (or as a series of commits landing on the same branch, merged atomically).
2. Deploy the updated PWA. No server-side coordination required for the UI text changes.
3. Separately, update the n8n workflow's "Call Gemini" node body to match the new system prompt in `docs/n8n-setup-guide.md`. This is a follow-up action — the PWA will continue to function with the old AI output until the n8n workflow is updated.
4. No database migrations. No environment variable changes. No service-worker invalidation needed (existing SW will pick up the new bundles on next deploy).
5. Rollback: revert the commit. Since all changes are string-literal replacements with no data model impact, a revert restores the British text and the system returns to its pre-change state.

## Open Questions

- None blocking. The two open follow-ups (n8n prompt redeploy, `/analyse` vs `/analyze` path alignment) are explicitly noted as out of scope in the proposal.
