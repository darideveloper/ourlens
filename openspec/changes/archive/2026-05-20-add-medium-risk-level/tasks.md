## 1. API and Types

- [x] 1.1 Update `RiskLevel` type in `src/lib/api/types.ts` to include `'Medium'`
- [x] 1.2 Update `isSafetyReport` validation in `src/lib/api/analyze-frames.ts` to permit `'Medium'` riskLevel
- [x] 1.3 Add a "Medium" risk hazard to `DUMMY_HAZARDS` in `src/lib/api/analyze-frames.ts` for development testing

## 2. UI Components

- [x] 2.1 Update `HazardCard` in `src/components/atoms/HazardCard.tsx` to support `Medium` risk level styling using `warning` tokens
- [x] 2.2 Update `SafetyReport` in `src/components/organisms/SafetyReport.tsx` to calculate `mediumCount`
- [x] 2.3 Add Medium risk summary banner to `SafetyReport` UI

## 3. Validation

- [x] 3.1 Verify "Medium" hazards display correctly with amber styling
- [x] 3.2 Verify the summary count correctly reflects the number of Medium hazards
- [x] 3.3 Ensure the app doesn't fallback to the default error state when the API returns "Medium"
