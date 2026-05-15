# Change: Round progress percentage display to integers

## Why
The progress simulation increments by `1.5` during the analyzing state, producing decimal values (e.g. `1.5%`, `4.5%`, `87%`). Displaying fractional percentages on a simulated progress bar is misleading precision — the value is not measuring real upload bytes, so showing `.5` adds visual noise without meaningful information.

## What Changes
- The displayed percentage label (`{progress}% complete`) SHALL be rounded to the nearest integer before render
- The `aria-valuenow` attribute SHALL also reflect the rounded integer for consistent screen reader output
- The internal `progress` value in the Zustand store remains a `number` (floats allowed) — only the display layer rounds

## Impact
- Affected specs: `processing-overlay`
- Affected code: `src/components/molecules/ProcessingOverlay.tsx` (display only — one `Math.round()` call)
