## Context

The current `RiskLevel` type is a union of `'Low' | 'High'`. The UI maps these to green (`safe`) and red (`danger`) respectively. The project uses Tailwind v4 via `@theme` in `global.css`, which already includes a `warning` color scale that is currently underutilized in the safety report.

## Goals / Non-Goals

**Goals:**
- Add `'Medium'` to the `RiskLevel` type.
- Ensure the API client correctly validates and parses `'Medium'` from the backend.
- Update `HazardCard` to render Medium risks using the `warning` color palette.
- Update `SafetyReport` to display a summary badge for Medium risks.

**Non-Goals:**
- Changing the backend logic (this change assumes the backend will start sending `'Medium'`).
- Modifying the camera scanning logic.

## Decisions

- **Color Mapping**:
    - `High` -> `danger` (Red) - No change.
    - `Medium` -> `warning` (Orange/Amber) - New mapping.
    - `Low` -> `safe` (Green) - No change.
- **Data Validation**:
    - Update the `isSafetyReport` type guard in `analyze-frames.ts` to include `'Medium'`.
- **UI Architecture**:
    - `HazardCard`: Add a third branch to the conditional styling for `Medium`.
    - `SafetyReport`: Add `mediumCount` calculation and a summary banner for Medium risks if they exist.

## Risks / Trade-offs

- **[Risk]** API returns `'Medium'` before the frontend is updated. → **[Mitigation]** The current `parseSafetyReport` has a fallback that will mark unknown data as a generic "Analysis Complete" hazard, preventing a crash.
- **[Trade-off]** Adding more colors might clutter the UI if there are many hazards. → **[Mitigation]** Use the same structure as existing banners to maintain visual consistency.

## Migration Plan

1.  **Deploy Frontend**: Update types, validation, and UI components first.
2.  **Update Backend**: Update the n8n system prompt to allow and generate `'Medium'` risk hazards.
3.  **Verification**: Perform a live scan to ensure "Medium" hazards are correctly parsed and rendered.

## Open Questions

- Should "Medium" risks be grouped with "High" or "Low" if we ever move to a more simplified view? (Currently they are displayed individually in the list, which is preferred).
- Is the `warning-700` text on `warning-50` background sufficient for WCAG AAA compliance? (Calculated OKLCH values suggest it is, but should be verified with a contrast tool).
