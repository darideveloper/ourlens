# Change: Phase 4 — Processing, API Integration & Safety Report

## Why

This phase implements the AI analysis flow and results display. After the camera captures frames (Phase 3), the processing overlay shows progress while frames are submitted to the n8n backend via the API layer (Phase 2). When analysis completes, the user is redirected to the Safety Report page showing identified hazards with risk levels and actionable recommendations. This phase also implements scan history storage via Zustand persist.

## What Changes

- **Analysis Zustand store:** `use-analysis-store.ts` (NOT persisted) for analysis state: `idle | uploading | analyzing | complete | error`, simulated progress (0-90%), cancel via AbortController
- **React hook:** `useAnalysis.ts` — orchestrates frame submission → progress simulation → `safeFetch<SafetyReport>()` → `parseSafetyReport()` runtime validation → redirect to `/report`
- **Atomic components:** `Spinner.tsx` (animated loading spinner with `motion-reduce:animate-none`)
- **Molecular components:** `ProcessingOverlay.tsx` (full-screen "Scanning..." overlay with progress bar, status text, cancel button, `motion-reduce:` fallback)
- **Component integration:** ProcessingOverlay wired into CameraScanner — shown within Scanner page during analysis (not a separate route)
- **Astro components:** `HazardCard.astro` (single hazard item with name, risk badge, recommendation), `RiskBadge.astro` (color-coded risk level badge)
- **Organism:** `SafetyReport.tsx` — React island composing HazardCards with summary header, reads from `use-scan-store`
- **Page wiring:** `report.astro` renders SafetyReport with `useHydratedScanStore` hook for persist hydration delay
- **Error handling:** API failure states (timeout, network error, invalid response, no hazards) with "Try Again" button
- **Scan history:** Save completed results to Zustand scan store (persisted, capped at 10 entries)
- **Navigation:** "Scan Again" button on report screen clears scan data and navigates to `/scanner`

## Impact

- Affected specs: processing-overlay, safety-report, frontend-accessibility
- Affected code: `src/stores/use-analysis-store.ts`, `src/hooks/useAnalysis.ts`, `src/components/atoms/Spinner.tsx`, `src/components/molecules/ProcessingOverlay.tsx`, `src/components/molecules/HazardCard.astro`, `src/components/atoms/RiskBadge.astro`, `src/components/organisms/SafetyReport.tsx`, `src/pages/report.astro`, `src/pages/scanner.astro` (ProcessingOverlay integration)
- **Prerequisites:** Phase 1 (foundation), Phase 2 (API layer, stores, AuthGuard), Phase 3 (camera, frame extraction)
- **Depended on by:** Phase 5 (accessibility audit of processing/report components)