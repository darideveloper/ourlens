# processing-overlay Specification

## Purpose
TBD - created by archiving change add-ourlens-pwa-phase-4. Update Purpose after archive.
## Requirements
### Requirement: Processing State Display
The system SHALL display a full-screen "Scanning..." overlay within the Scanner page (not as a separate route) with a progress animation while awaiting the AI analysis response from n8n. The overlay SHALL use a Zustand analysis store to track state (`idle | uploading | analyzing | complete | error`) and simulated progress (0-90%).

#### Scenario: Frames submitted for analysis
- **WHEN** the user submits captured frames for analysis
- **THEN** the system SHALL immediately show a Processing overlay within the Scanner page
- **AND** the overlay SHALL include a progress bar animating from 0-90% (never reaching 100% until real response)
- **AND** the overlay SHALL display status text ("Sending photos..." / "Analyzing your home...")
- **AND** the overlay SHALL include a "Cancel" button to abort the request

#### Scenario: Analysis completes successfully
- **WHEN** the n8n webhook returns a successful analysis response
- **THEN** the system SHALL dismiss the Processing overlay
- **AND** SHALL navigate to the Safety Report page with the received data via `navigate('/report')`

#### Scenario: Analysis with reduced motion preference
- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** the Processing overlay SHALL disable the progress animation and display a static indicator instead

### Requirement: Processing Timeout and Error Handling
The system SHALL handle timeout (45s) and error scenarios from the n8n API with user-friendly messages, retry options, and proper cleanup.

#### Scenario: API request times out
- **WHEN** the n8n API request exceeds 45 seconds without a response
- **THEN** the system SHALL dismiss the Processing overlay
- **AND** SHALL display a timeout error message with a "Try Again" button
- **AND** SHALL abort the request via AbortController

#### Scenario: API returns an error response
- **WHEN** the n8n API returns a non-successful HTTP status code
- **THEN** the system SHALL dismiss the Processing overlay
- **AND** SHALL display a `FetchError`-typed error message appropriate to the error type
- **AND** SHALL provide a "Try Again" button

