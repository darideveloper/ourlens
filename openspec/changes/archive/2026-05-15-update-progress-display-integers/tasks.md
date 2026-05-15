## 1. Implementation

- [x] 1.1 In `src/components/molecules/ProcessingOverlay.tsx`, derive `displayProgress = Math.round(progress)` and replace all uses of `{progress}` in the JSX (percentage label and `aria-valuenow`) with `{displayProgress}`
- [x] 1.2 Verify the progress bar `style={{ width: \`${progress}%\` }}` continues to use the raw float for smooth animation — do NOT round the width

## 2. Validation

- [x] 2.1 Start the dev server and open `/scanner`; trigger analysis and confirm the percentage label shows only whole numbers (0%, 1%, 2%, … 90%, 100%)
- [x] 2.2 Confirm no `.5` or other decimal values appear in the label during the analyzing phase
