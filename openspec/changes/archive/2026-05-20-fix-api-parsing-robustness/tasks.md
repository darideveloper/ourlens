## 1. Refactor API Parsing Logic

- [x] 1.1 Implement risk level normalization in `src/lib/api/analyze-frames.ts` (handle "low", "medium", "high" case-insensitively).
- [x] 1.2 Update `isSafetyReport` to use normalized risk levels and be more robust.
- [x] 1.3 Update `parseSafetyReport` to unwrap array responses (`[{ ... }]`) and extract the `output` field if present.
- [x] 1.4 Add `console.warn` diagnostic logging in `parseSafetyReport` when parsing falls back to the default error entry.

## 2. API Configuration Updates

- [x] 2.1 Increase the analysis timeout from 45s to 60s in `src/lib/api/analyze-frames.ts`.
- [x] 2.2 Verify `safeFetch` configuration in `src/lib/api/analyze-frames.ts` correctly applies the new timeout.

## 3. Verification

- [x] 3.1 Create a temporary test script or use a mock response to verify the parsing of the user-provided array-wrapped response.
- [x] 3.2 Verify that lowercase risk levels from the API are correctly mapped to the expected `RiskLevel` type.
- [x] 3.3 Verify that the report page successfully displays hazards when given the unwrapped and normalized data.
