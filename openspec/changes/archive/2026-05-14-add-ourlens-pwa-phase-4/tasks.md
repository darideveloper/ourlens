## Phase 4: Processing, API Integration & Safety Report

- [x] 4.1 Create `src/stores/use-analysis-store.ts` — Zustand store (NOT persisted) for analysis state: `idle | uploading | analyzing | complete | error`, simulated progress (0-90%), cancel via AbortController
- [x] 4.2 Create `src/hooks/useAnalysis.ts` — React hook orchestrating frame submission → progress simulation → `safeFetch<SafetyReport>()` → `parseSafetyReport()` runtime validation → redirect to `/report`
- [x] 4.3 Create atom: `src/components/atoms/Spinner.tsx` — animated loading spinner with `motion-reduce:animate-none`
- [x] 4.4 Create molecule: `src/components/molecules/ProcessingOverlay.tsx` — React island (`client:idle`) full-screen "Scanning..." overlay with progress bar, status text, cancel button, `motion-reduce:` fallback
- [x] 4.5 Wire ProcessingOverlay into CameraScanner — shown within the Scanner page during analysis (not a separate route)
- [x] 4.6 Create molecule: `src/components/molecules/HazardCard.astro` — single hazard item with name, risk level badge, and recommendation
- [x] 4.7 Create atom: `src/components/atoms/RiskBadge.astro` — color-coded risk level badge (Low=`safe-500`, High=`danger-500`) with `contrast-more:border-2`
- [x] 4.8 Create organism: `src/components/organisms/SafetyReport.tsx` — React island composing list of HazardCards with summary header, reads from `use-scan-store`
- [x] 4.9 Wire `src/pages/report.astro` to render SafetyReport; use `useHydratedScanStore` hook to handle persist hydration delay
- [x] 4.10 Add "Scan Again" button on report screen clearing scan data and navigating to `/scanner`
- [x] 4.11 Add error states for API failures: timeout, network error, invalid response, no hazards found — with user-friendly messages and "Try Again" button
- [x] 4.12 Save completed scan results to Zustand scan store (persisted to localStorage, capped at 10)
- [x] 4.13 Playwright test: full end-to-end flow with dummy API — enter code → instructions → scanner → processing overlay visible → report with hazard data