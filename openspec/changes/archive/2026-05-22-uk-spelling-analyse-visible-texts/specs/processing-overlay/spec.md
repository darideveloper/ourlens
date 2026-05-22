## MODIFIED Requirements

### Requirement: Processing State Display

The system SHALL display a full-screen "Scanning..." overlay within the Scanner page (not as a separate route) with a progress animation while awaiting the AI analysis response from n8n. The overlay background SHALL use a glass-morphism effect (`bg-surface/80 backdrop-blur-md`) for a modern frosted appearance, with `overscroll-behavior: contain` to prevent background scrolling. The overlay SHALL use a Zustand analysis store to track state (`idle | uploading | analyzing | complete | error`) and simulated progress (0-90%). User-facing status messages SHALL use "video" terminology: `"Uploading video…"` for the uploading state and `"Analysing video…"` for the analyzing state (with proper ellipsis character `…`, not three dots `...`). The progress bar fill SHALL use a gradient background (`bg-gradient-to-r from-brand-500 to-accent-400`). The progress percentage label and `aria-valuenow` attribute SHALL display the value rounded to the nearest integer (no decimal places); the raw float MAY be retained internally for smooth bar-width animation. The progress percentage label SHALL use `tabular-nums` for alignment.

#### Scenario: Frames submitted for analysis
- **WHEN** the user submits captured frames for analysis
- **THEN** the system SHALL show a Processing overlay within the Scanner page
- **AND** the overlay background SHALL use glass-morphism (`bg-surface/80 backdrop-blur-md`) for readable text
- **AND** the overlay SHALL have `overscroll-behavior: contain` to prevent background scrolling
- **AND** the overlay SHALL include a progress bar with gradient fill animating from 0-90%
- **AND** the progress percentage label SHALL use `tabular-nums` for alignment
- **AND** the progress percentage label SHALL show only whole numbers (no decimals) at all times
- **AND** the overlay SHALL display status text ("Uploading video…" / "Analysing video…") with ellipsis character
- **AND** the overlay SHALL include a "Cancel" button to abort the request
- **AND** the overlay SHALL NOT mention "photos", "frames", or that the camera is active
