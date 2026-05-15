# Change: Fix Scan Again State Reset

## Why

Two bugs exist in the "Scan Again" flow originating from a single handler in `ReportPage.tsx`. First, clicking "Scan Again" from a hazard report causes a brief flash of the "No Hazards Detected" (EmptyReport) screen before navigation completes — because scan state is cleared synchronously before Astro's navigation resolves. Second, when the user returns to the scanner page, the camera never auto-starts because `useCameraStore.status` is not reset to `'idle'`, violating the existing camera-scanner spec which mandates this reset.

## What Changes

- `src/components/organisms/ReportPage.tsx` — `handleScanAgain` is made async; `useCameraStore.reset()` is called before navigation so the scanner mounts with `status = 'idle'`; `navigate('/scanner')` is awaited so scan state is cleared only after the page has changed
- `openspec/specs/safety-report/spec.md` — "Scan Again Navigation" requirement updated to specify the correct ordering: camera store reset → navigate → clear scan/analysis state

## Impact

- Affected specs: `safety-report`, `camera-scanner` (pre-existing scenario already describes correct behavior; code now matches it)
- Affected code: `src/components/organisms/ReportPage.tsx` (single handler, ~4 lines)
- No new dependencies, no API changes, no store schema changes
