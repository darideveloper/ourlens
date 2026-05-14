# safety-report Specification

## Purpose
TBD - created by archiving change add-ourlens-pwa-phase-4. Update Purpose after archive.
## Requirements
### Requirement: Safety Report Display
The system SHALL display a Safety Report page showing the list of hazards identified by the AI, each with a hazard name, risk level badge (Low/High), and actionable recommendation. The report SHALL read scan data from the Zustand scan store using a hydration-safe hook.

#### Scenario: Report with multiple hazards
- **WHEN** the AI analysis returns multiple hazards
- **THEN** the system SHALL render a Safety Report page
- **AND** each hazard SHALL be displayed as a card containing: hazard name, risk level badge, and actionable recommendation
- **AND** hazards with "High" risk level SHALL be visually prominent (`danger-500` color with `contrast-more:border-2`)
- **AND** hazards with "Low" risk level SHALL use a subdued indicator (`safe-500` color)

#### Scenario: Report with no hazards found
- **WHEN** the AI analysis returns an empty list of hazards
- **THEN** the system SHALL display a "No hazards detected" message
- **AND** SHALL include a "Scan Again" button linking back to the Camera Scanner

#### Scenario: Zustand store hydration delay
- **WHEN** the Safety Report page renders before the persist middleware has rehydrated from localStorage
- **THEN** the system SHALL show a loading state or empty state
- **AND** SHALL display the full report once hydration completes

### Requirement: Scan Again Navigation
The Safety Report page SHALL provide a "Scan Again" button that navigates the user back to the Camera Scanner page and clears the current scan data.

#### Scenario: User taps Scan Again
- **WHEN** user taps the "Scan Again" button on the Safety Report
- **THEN** the system SHALL navigate to `/scanner` via `navigate('/scanner')`
- **AND** SHALL clear the previous scan data from the current session (not from history)

### Requirement: Scan History Storage
The system SHALL save completed scan results via Zustand scan store with persist middleware for localStorage-backed history retrieval, capped at a maximum of 10 entries with oldest-first eviction.

#### Scenario: Scan completed
- **WHEN** a scan completes and the Safety Report is displayed
- **THEN** the system SHALL save the scan result to the Zustand scan store's `addToHistory` action
- **AND** the store SHALL persist the data to localStorage automatically via persist middleware with `skipHydration: true`
- **AND** SHALL maintain a maximum of 10 history entries, removing the oldest when exceeded

