## Context

Phase 3 implements the camera scanner with frame extraction. This phase connects the camera output to the AI backend, displays progress to the user, and renders the final safety report. The processing overlay is shown within the Scanner page (not a separate route) to preserve camera stream state.

## Goals / Non-Goals

### Goals
- Submit captured frames to the n8n backend via the Phase 2 API layer
- Show a processing overlay with simulated progress while awaiting AI response
- Handle errors gracefully (timeout, network, invalid response, no hazards)
- Render a safety report with hazard cards, risk badges, and actionable recommendations
- Save scan results to history (capped at 10 entries, localStorage-backed)

### Non-Goals
- PWA update prompts (deferred to Phase 5)
- Accessibility audit and polish (deferred to Phase 5)

## Decisions

### Processing Overlay is NOT a Separate Route

- **Decision:** The processing overlay is shown within the Scanner page using `<CameraScanner>` with `transition:persist`. Navigating away would kill the camera stream and lose state.
- **Rationale:** The overlay is conditionally rendered inside `CameraScanner.tsx` based on the analysis store state. When analysis starts, the camera controls are hidden and the overlay appears.

```astro
<!-- Scanner page: Processing is an overlay, not a route -->
<CameraScanner client:load transition:persist="scanner" />
```

### n8n API Data Contract

- **Decision:** The n8n frame submission webhook returns `{ hazards: [{ name: string, riskLevel: "Low" | "High", recommendation: string }] }`. Runtime validation with `parseSafetyReport()` wraps unexpected AI output in a safe default.
- **Rationale:** AI output is unpredictable. Runtime validation prevents crashes from malformed responses.

```ts
// src/lib/api/analyze-frames.ts — runtime validation
function isSafetyReport(data: unknown): data is SafetyReport {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  if (!Array.isArray(obj.hazards)) return false;
  return obj.hazards.every(
    (h) => typeof h.name === 'string' && (h.riskLevel === 'Low' || h.riskLevel === 'High') && typeof h.recommendation === 'string',
  );
}

function parseSafetyReport(data: unknown): SafetyReport {
  if (isSafetyReport(data)) return data;
  return { hazards: [{ name: 'Analysis Complete', riskLevel: 'Low', recommendation: 'We couldn\'t parse the detailed results. Please try scanning again.' }] };
}
```

### Navigation from React Islands

```ts
// Navigation from React islands uses astro:transitions/client
import { navigate } from 'astro:transitions/client';
navigate('/report'); // SPA-like navigation
```

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| n8n webhook latency (5-15s) | Progress overlay with simulated progress (0-90%) + 45s timeout + cancel button |
| AI response unpredictable | Runtime validation `parseSafetyReport()` wraps malformed output in safe default |
| Base64 payload size on slow connections | 1024px resize + 0.7 JPEG quality ≈ 200-400KB/frame; 4 frames ≈ 1.6MB max |

## Open Questions

- None specific to this phase.