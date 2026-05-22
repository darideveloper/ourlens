## Why

The app targets a UK/European audience but currently uses US English spelling ("Analyze") in user-visible text. This change aligns all user-facing Analyze/Analyzing/Analyzes text to British English spelling ("Analyse/Analysing/Analyses) for consistency with the target market. Only visible text is changed — no internal code, function names, type names, file names, or API routes are affected.

## What Changes

- `CameraScanner.tsx`: Button text `"Analyze video"` → `"Analyse video"`
- `ProcessingOverlay.tsx`: Status message `'Analyzing video…'` → `'Analysing video…'`
- `InstructionalHome.astro`: Paragraph text `"analyzes your home"` → `"analyses your home"`
- `src/lib/api/analyze-frames.ts`: Update `DUMMY_HAZARDS` recommendations: `"36 inches"` → `"90 cm"`, `"shower/tub"` → `"shower/bath"`, and `"electrical cords"` → `"electrical cables"`
- `tests/e2e/analysis-flow.spec.ts`: E2E test selectors `button:has-text("Analyze")` → `button:has-text("Analyse")`
- `openspec/specs/camera-scanner/spec.md`: Update spec requirement text referencing `"Analyze video"` → `"Analyse video"`
- `openspec/specs/processing-overlay/spec.md`: Update spec requirement text referencing `"Analyzing video…"` → `"Analysing video…"`

All changes are purely cosmetic string updates. No behavior, logic, or data model changes.

## Capabilities

### New Capabilities

*(none — no new capabilities introduced)*

### Modified Capabilities

- `camera-scanner`: The "Analyze video" button text requirement changes to "Analyse video" (UK spelling)
- `processing-overlay`: The "Analyzing video…" status message requirement changes to "Analysing video…" (UK spelling)

## Impact

- **Components**: 3 files updated (CameraScanner.tsx, ProcessingOverlay.tsx, InstructionalHome.astro)
- **API**: 1 file updated (analyze-frames.ts) for dummy data strings
- **Tests**: 1 E2E file updated (analysis-flow.spec.ts) — 3 selector occurrences
- **Specs**: 2 spec files updated (camera-scanner, processing-overlay)
- **No impact** on: API routes, data models, stores, hooks, types, internal function names, file names, build process, dependencies
