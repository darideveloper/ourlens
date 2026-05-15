# safety-report Specification

## Purpose
TBD - created by archiving change add-ourlens-pwa-phase-4. Update Purpose after archive.
## Requirements
### Requirement: Safety Report Display
The system SHALL display a Safety Report page showing the list of hazards identified by the AI, each with a hazard name, risk level badge (Low/High), and actionable recommendation. The report SHALL read scan data from the Zustand scan store using a hydration-safe hook. The report header SHALL display the Ourlens logo. Hazard cards SHALL have shadow styling (`shadow-card hover:shadow-elevated`) and stagger-animate in with `slide-up` effect. Hazard counts SHALL use `tabular-nums` for numeric alignment. The "No Hazards Detected" empty state SHALL include an animated success checkmark with spring effect.

#### Scenario: Report with multiple hazards
- **WHEN** the AI analysis returns multiple hazards
- **THEN** the system SHALL render a Safety Report page with the Ourlens logo in the header
- **AND** each hazard SHALL be displayed as a card with `shadow-card` and `hover:shadow-elevated` styling
- **AND** hazards with "High" risk level SHALL be visually prominent (`danger-500` color with `contrast-more:border-2`)
- **AND** hazards with "Low" risk level SHALL use a subdued indicator (`safe-500` color)
- **AND** hazard cards SHALL animate in with staggered `slide-up` effect
- **AND** hazard counts SHALL use `tabular-nums` for numeric alignment

#### Scenario: Report with no hazards found
- **WHEN** the AI analysis returns an empty list of hazards
- **THEN** the system SHALL display a "No hazards detected" message with an animated success checkmark
- **AND** SHALL include a "Scan Again" button with gradient background
- **AND** the success checkmark SHALL have a spring/scale animation effect

#### Scenario: Zustand store hydration delay
- **WHEN** the Safety Report page renders before the persist middleware has rehydrated from localStorage
- **THEN** the system SHALL show a skeleton loading state matching the report card layout (gray rectangles for heading, text, badges) with `shimmer` animation
- **AND** SHALL display the full report once hydration completes
- **AND** skeletons SHALL be disabled when `prefers-reduced-motion: reduce` is active

### Requirement: Scan Again Navigation
The Safety Report page SHALL provide a "Scan Again" button that returns the user to the Camera Scanner page. When tapped, the handler SHALL (1) reset `useCameraStore` to `idle` so the camera auto-starts immediately on the scanner page, (2) await `navigate('/scanner')` so the report page is no longer rendered before any state is cleared, and (3) only after navigation resolves, clear the current scan data and reset the analysis store. This ordering prevents a transient render of the "No Hazards Detected" state on the report page and ensures the camera begins initialising as soon as the scanner mounts.

#### Scenario: User taps Scan Again from hazard report
- **WHEN** the user taps "Scan Again" on the Safety Report showing hazards
- **THEN** the system SHALL reset `useCameraStore` status to `idle` before navigating
- **AND** SHALL navigate to `/scanner` and await the navigation to complete
- **AND** SHALL clear the current scan data only after navigation resolves
- **AND** SHALL reset the analysis store only after navigation resolves
- **AND** the report page SHALL NOT render the "No Hazards Detected" screen at any point during this transition

#### Scenario: User taps Scan Again from empty report
- **WHEN** the user taps "Scan Again" on the "No Hazards Detected" screen
- **THEN** the system SHALL follow the same ordering: camera store reset → await navigate → clear scan state
- **AND** SHALL NOT flash any intermediate screen state during the transition

#### Scenario: Camera auto-starts on return to scanner
- **WHEN** the scanner page mounts after a "Scan Again" action
- **THEN** `useCameraStore.status` SHALL be `idle`
- **AND** the `useCamera` hook SHALL immediately begin acquiring the camera stream
- **AND** the user SHALL see the "Starting camera…" spinner followed by the live camera view within the normal startup window (~1–2 seconds)

### Requirement: Scan History Storage
The system SHALL save completed scan results via Zustand scan store with persist middleware for localStorage-backed history retrieval, capped at a maximum of 10 entries with oldest-first eviction.

#### Scenario: Scan completed
- **WHEN** a scan completes and the Safety Report is displayed
- **THEN** the system SHALL save the scan result to the Zustand scan store's `addToHistory` action
- **AND** the store SHALL persist the data to localStorage automatically via persist middleware with `skipHydration: true`
- **AND** SHALL maintain a maximum of 10 history entries, removing the oldest when exceeded

