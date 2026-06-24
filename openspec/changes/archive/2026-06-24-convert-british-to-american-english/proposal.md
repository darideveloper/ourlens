## Why

The project was originally scoped for a UK/European audience, and change `2026-05-22-uk-spelling-analyse-visible-texts` (plus `2026-05-25-update-invitation-code-error-message`) migrated all user-facing text to British English. The target market has since shifted to a US audience, so we need to revert those UK-specific changes to American English to match the actual client base. This change is a deliberate inversion of the prior migration and supersedes the two archived UK-spelling changes.

## What Changes

- **UI strings (4 files, 4 strings):** `analyse` → `analyze`, `analyses` → `analyzes`, `analysing` → `analyzing`, `recognised` → `recognized` in shipped components and stores.
- **E2E test selector (1 file, 3 occurrences):** `button:has-text("Analyse")` → `button:has-text("Analyze")`.
- **Client-facing doc (`CLIENT_README.md`):** 3 `analyse` references → `analyze`; 2 `behaviour` references → `behavior`.
- **Dev doc (`docs/render-mermaid.md`):** 2 prose `colour`/`colours` references → `color`/`colors`. (Mermaid `style … colour:#fff` syntax lines stay British — `colour` is Mermaid's native keyword, not project text.)
- **Dev doc (`docs/diagrams/component-structure.md`):** 1 `Colour-coded` reference in a code-block comment → `Color-coded`.
- **Dev doc (`docs/n8n-setup-guide.md`):** 7 `analyse`/`analyse-frames`/`optimise` references → `analyze`/`analyze-frames`/`optimize`. Update the n8n system prompt to instruct **American English** in the AI's output (the AI's user-visible hazard text).
- **Delta specs (3 files):** `camera-scanner`, `processing-overlay`, `access-control` — flip the exact-text requirements from British to American.
- **9 previously-flagged US outliers in active specs/docs become correct/consistent** (no edit required for those — they were already American, and now match the new convention). These are: `visual-design-system/spec.md:130` (already says "Analyze video"), `visual-design-system/spec.md:114,118` (already says "gray"), `safety-report/spec.md:33` (already says "gray"), `package-management/spec.md:36` (already says "behavior"), `auth-and-banner.spec.ts:64` (already says "behavior"), `docs/project.md:77,92` (already says "Analyze"/"optimize").
- **Internal identifiers stay American (no change):** function `analyze`, state literal `'analyzing'`, file `analyze-frames.ts`, API route `/analyze`, type `AnalyzeFramesRequest`. These were already American under the previous UK-spelling policy and remain American.
- **Mermaid syntax stays British:** all `style … colour:#fff` and JSON keys `background_colour`/`theme_colour` in `docs/diagrams/*.md` and the manifest example in `docs/diagrams/development-phases.md` are Mermaid/PWA-manifest language, not project-visible text.
- **n8n webhook path stays `/analyse`:** the live n8n workflow uses `ourlens/analyse` (per `docs/diagrams/n8n-workflow.md` and the deployed n8n). The client calls the n8n base URL, so changing the path requires coordinated redeploy of the n8n workflow. **Out of scope for this change** — a follow-up to align `/analyze` ↔ `/analyse` will be tracked separately.

## Capabilities

### New Capabilities

(none — this is a reversal of existing capability text)

### Modified Capabilities

- `camera-scanner`: button text requirement changes from `"Analyse video"` to `"Analyze video"`; flow label changes from `"record video → analyse video"` to `"record video → analyze video"`.
- `processing-overlay`: status message requirement changes from `"Analysing video…"` to `"Analyzing video…"`.
- `access-control`: error message changes from `"That invitation code is not recognised or expired…"` to `"That invitation code is not recognized or expired…"`.
- `instructional-home`: no requirement-level change. The Instructional Home spec does not mandate the exact phrase "analyzes your home" — it defines high-level content. The component text will be updated, but no delta spec is required for this capability.

## Impact

- **Components:** 3 files updated (`src/components/organisms/CameraScanner.tsx`, `src/components/molecules/ProcessingOverlay.tsx`, `src/components/organisms/InstructionalHome.astro`).
- **Stores:** 1 file updated (`src/stores/use-session-store.ts`).
- **Tests:** 1 E2E file updated (`tests/e2e/analysis-flow.spec.ts`).
- **Specs:** 3 delta spec files created under `openspec/changes/convert-british-to-american-english/specs/` for `camera-scanner`, `processing-overlay`, `access-control`.
- **Client doc:** `CLIENT_README.md` updated.
- **Dev docs:** `docs/render-mermaid.md`, `docs/diagrams/component-structure.md`, `docs/n8n-setup-guide.md` updated.
- **n8n system prompt:** the AI is instructed to use American English in returned hazard text. This affects what end users see in every report after the n8n workflow is redeployed with the new prompt. If the n8n workflow is not redeployed, AI output will continue to use British English until the prompt is updated server-side.
- **Supersedes:** the two archived changes `2026-05-22-uk-spelling-analyse-visible-texts` and `2026-05-25-update-invitation-code-error-message` are logically reversed (their `before` state becomes the new `after` state). They stay in the archive as historical record.
- **No impact:** API routes, data models, internal function names, file names, store names, hook names, CSS tokens, Mermaid syntax keywords, PWA manifest JSON keys, build process, dependencies.
