## MODIFIED Requirements

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
