## 1. Update Component Text Strings

- [x] 1.1 Update "Analyze video" → "Analyse video" in `CameraScanner.tsx`
- [x] 1.2 Update "Analyzing video…" → "Analysing video…" in `ProcessingOverlay.tsx`
- [x] 1.3 Update "analyzes your home" → "analyses your home" in `InstructionalHome.astro`
- [x] 1.4 Update `DUMMY_HAZARDS` in `analyze-frames.ts` (36 inches → 90 cm, tub → bath, cords → cables)

## 2. Update Spec Delta Files

- [x] 2.1 Verify `camera-scanner` delta spec contains all required "Analyse" text references
- [x] 2.2 Verify `processing-overlay` delta spec contains all required "Analysing" text references

## 3. Update E2E Tests

- [x] 3.1 Update `button:has-text("Analyze")` → `button:has-text("Analyse")` in `analysis-flow.spec.ts` (3 occurrences)

## 4. Verification

- [x] 4.1 Run E2E tests to confirm selectors target the updated button text
- [x] 4.2 Build project and visually confirm no other "Analyze" variants remain in user-visible text
