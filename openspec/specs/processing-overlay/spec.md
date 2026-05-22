# processing-overlay Specification

## Purpose
TBD - created by archiving change add-ourlens-pwa-phase-4. Update Purpose after archive.
## Requirements
### Requirement: Processing State Display
The system SHALL display a full-screen "Scanning..." overlay within the Scanner page (not as a separate route) with a progress animation while awaiting the AI analysis response from n8n. The overlay background SHALL use a glass-morphism effect (`bg-surface/80 backdrop-blur-md`) for a modern frosted appearance, with `overscroll-behavior: contain` to prevent background scrolling. The overlay SHALL use a Zustand analysis store to track state (`idle | uploading | analyzing | complete | error`) and simulated progress (0-90%). User-facing status messages SHALL use "video" terminology: `"Uploading video…"` for the uploading state and `"Analysing video…"` for the analysing state (with proper ellipsis character `…`, not three dots `...`). The progress bar fill SHALL use a gradient background (`bg-gradient-to-r from-brand-500 to-accent-400`). The progress percentage label and `aria-valuenow` attribute SHALL display the value rounded to the nearest integer (no decimal places); the raw float MAY be retained internally for smooth bar-width animation. The progress percentage label SHALL use `tabular-nums` for alignment.

#### Scenario: Frames submitted for analysis
- **WHEN** the user submits captured frames for analysis
- **THEN** the system SHALL show a Processing overlay within the Scanner page
- **AND** the overlay background SHALL use glass-morphism (`bg-surface/80 backdrop-blur-md`) for readable text
- **AND** the overlay SHALL have `overscroll-behavior: contain` to prevent background scrolling
- **AND** the overlay SHALL include a progress bar with gradient fill animating from 0-90%
- **AND** the progress percentage label SHALL use `tabular-nums` for alignment
- **AND** the progress percentage label SHALL show only whole numbers (no decimals) at all times
- **AND** the overlay SHALL display status text ("Uploading video…" / "Analyzing video…") with ellipsis character
- **AND** the overlay SHALL include a "Cancel" button to abort the request
- **AND** the overlay SHALL NOT mention "photos", "frames", or that the camera is active

#### Scenario: Progress increments by fractional amount
- **WHEN** the internal progress value advances by a non-integer step (e.g. +1.5)
- **THEN** the displayed percentage label SHALL show `Math.round(progress)` (e.g. `2%` not `1.5%`)
- **AND** `aria-valuenow` SHALL reflect the same rounded integer
- **AND** the progress bar width MAY use the raw float value for smooth animation

#### Scenario: Analysis completes successfully
- **WHEN** the n8n webhook returns a successful analysis response
- **THEN** the system SHALL dismiss the Processing overlay
- **AND** SHALL navigate to the Safety Report page with the received data via `navigate('/report')`

#### Scenario: Analysis with reduced motion preference
- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** the Processing overlay SHALL disable the progress animation and display a static indicator instead
- **AND** the progress bar SHALL not animate

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

