# Tasks: fix-scan-again-state-reset

## 1. Implementation

- [x] 1.1 Add `useCameraStore` import to `src/components/organisms/ReportPage.tsx`
- [x] 1.2 Change `handleScanAgain` to `async`, call `useCameraStore.getState().reset()` first, then `await navigate('/scanner')`, then `clearCurrentScan()` and `useAnalysisStore.reset()`

## 2. Validation

- [x] 2.1 Complete a scan that finds hazards → tap "Scan Again" → confirm no EmptyReport flash and camera starts within ~1–2 seconds
- [x] 2.2 Complete a scan with no hazards → tap "Scan Again" from EmptyReport → confirm same behaviour
- [x] 2.3 Confirm cancelling mid-analysis (Cancel button) still works correctly (separate `cancel()` path in `useAnalysis.ts` is unaffected)
