## MODIFIED Requirements

### Requirement: Processing State Display
The system SHALL display a full-screen opaque "Scanning..." overlay within the Scanner page (not as a separate route) with a progress animation while awaiting the AI analysis response from n8n. The overlay SHALL use a Zustand analysis store to track state (`idle | uploading | analyzing | complete | error`) and simulated progress (0-90%). User-facing status messages SHALL use "video" terminology: `"Uploading video..."` for the uploading state and `"Analyzing video..."` for the analyzing state. The overlay background SHALL be fully opaque (`bg-surface`) to ensure text readability regardless of camera state. The overlay SHALL NOT reference "photos", "frames", or mention that the camera is active during analysis.

#### Scenario: Frames submitted for analysis
- **WHEN** the user submits captured frames for analysis
- **THEN** the system SHALL immediately show a Processing overlay within the Scanner page
- **AND** the overlay background SHALL be fully opaque (`bg-surface`) for readable text
- **AND** the overlay SHALL include a progress bar animating from 0-90% (never reaching 100% until real response)
- **AND** the overlay SHALL display status text ("Uploading video..." / "Analyzing video...")
- **AND** the overlay SHALL include a "Cancel" button to abort the request
- **AND** the overlay SHALL NOT mention "photos", "frames", or that the camera is active

#### Scenario: Analysis completes successfully
- **WHEN** the n8n webhook returns a successful analysis response
- **THEN** the system SHALL dismiss the Processing overlay
- **AND** SHALL navigate to the Safety Report page with the received data via `navigate('/report')`

#### Scenario: Analysis with reduced motion preference
- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** the Processing overlay SHALL disable the progress animation and display a static indicator instead