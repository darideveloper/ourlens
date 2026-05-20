## Why

Currently, the safety analysis only supports "Low" and "High" risk levels. This binary classification is too limiting for many safety hazards that fall into a middle ground—significant enough to warrant specific attention but not an immediate high-priority danger. Introducing a "Medium" risk level provides a more nuanced and accurate safety assessment for users.

## What Changes

- **API Types**: Update `RiskLevel` to include `'Medium'`.
- **API Parsing**: Update `parseSafetyReport` to correctly handle and validate `'Medium'` risk levels from the API response.
- **UI Components**: 
    - Update `HazardCard` to support a new visual style for Medium risk (e.g., orange/amber theme).
    - Update `SafetyReport` to include a summary section for Medium risks, similar to the existing High and Low counts.
- **Styling**: Add appropriate color tokens and utility classes for the "Medium" risk state in `global.css` or Tailwind config.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `api-integration`: Update the `RiskLevel` definition and parsing logic to include 'Medium'.
- `safety-report`: Update the report visualization to display and categorize 'Medium' risk hazards.
- `visual-design-system`: Define the visual language (colors, icons, contrast) for the 'Medium' risk level.

## Impact

- `src/lib/api/types.ts`: `RiskLevel` type definition.
- `src/lib/api/analyze-frames.ts`: `isSafetyReport` validation logic.
- `src/components/atoms/HazardCard.tsx`: Visual states and styling.
- `src/components/organisms/SafetyReport.tsx`: Summary logic and risk categorization.
- `src/styles/global.css`: Color variables and utility classes.
