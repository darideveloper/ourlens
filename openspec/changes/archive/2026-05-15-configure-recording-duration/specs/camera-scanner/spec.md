## MODIFIED Requirements

### Requirement: Snapshot Frame Extraction
The Camera Scanner SHALL implement live frame extraction from the camera stream: during a recording of configurable duration (controlled by the `PUBLIC_RECORD_DURATION_SECONDS` environment variable, default 3 seconds), extract exactly one frame per second using `canvas.drawImage(video)` and `requestAnimationFrame`, resize to 1024px width maintaining aspect ratio, compress to JPEG at 0.7 quality, and convert to Base64 strings. The total frame count equals the recording duration in seconds (e.g., 3 s → 3 frames, 10 s → 10 frames). Recording duration is baked in at build time via the `PUBLIC_RECORD_DURATION_SECONDS` public env var (accessible as `import.meta.env.PUBLIC_RECORD_DURATION_SECONDS`); if absent or invalid, the system SHALL fall back to 3 seconds. The user SHALL NOT see references to internal frame extraction; all user-facing labels SHALL present the flow as "record video → analyze video". After recording or capture completes and frames exist, the system SHALL show an "Analyze video" button with a gradient background (`bg-gradient-to-r from-brand-500 to-accent-500`) at the bottom of the screen (above the camera controls), only when the camera status is `ready`. The button SHALL NOT appear during active recording or capturing states. The "Recording" indicator SHALL use a glow-pulse animation (`animate-pulse-slow` with `ring-2 ring-danger-500`) and SHALL display a live countdown of remaining seconds in the format "Recording… Xs left" (e.g. "Recording… 2s left"), updating every second until recording stops. The Record button label SHALL dynamically reflect the configured duration (e.g., "Record 3-second video", "Record 10-second video").

#### Scenario: User records a video with default duration
- **WHEN** `PUBLIC_RECORD_DURATION_SECONDS` is unset and user taps the Record button
- **THEN** the system SHALL record for 3 seconds and extract 3 frames (one per second)
- **AND** SHALL resize each frame to 1024px width maintaining aspect ratio
- **AND** SHALL compress each frame to JPEG at 0.7 quality
- **AND** SHALL return an array of 3 Base64-encoded JPEG strings
- **AND** SHALL NOT display "Analyze video" button during the recording
- **AND** SHALL display a "Recording" indicator with glow-pulse animation
- **AND** SHALL display a countdown from 3 to 0 in the format "Recording… Xs left" during recording
- **AND** SHALL display "Analyze video" button with gradient background after recording completes (camera status returns to `ready`)
- **AND** the Record button label SHALL read "Record 3-second video"

#### Scenario: User records a video with custom duration
- **WHEN** `PUBLIC_RECORD_DURATION_SECONDS=10` is set at build time and user taps the Record button
- **THEN** the system SHALL record for 10 seconds and extract 10 frames (one per second)
- **AND** SHALL compress and encode each frame identically to the default flow
- **AND** SHALL display a countdown from 10 to 0 in the format "Recording… Xs left" during recording
- **AND** the Record button label SHALL read "Record 10-second video"

#### Scenario: Invalid or missing env var
- **WHEN** `PUBLIC_RECORD_DURATION_SECONDS` is absent, empty, or non-integer
- **THEN** the system SHALL fall back to a 3-second recording duration
- **AND** SHALL behave identically to the default-duration scenario

#### Scenario: User captures a single photo
- **WHEN** user taps the Capture button
- **THEN** the system SHALL capture a single frame from the current camera view via `canvas.drawImage`
- **AND** SHALL resize the frame to 1024px width
- **AND** SHALL compress to JPEG at 0.7 quality
- **AND** SHALL return an array containing 1 Base64-encoded JPEG string
- **AND** SHALL display "Analyze video" button with gradient background after capture completes (camera status returns to `ready`)

#### Scenario: No video or photo captured
- **WHEN** user attempts to analyze without having recorded or captured anything
- **THEN** the system SHALL display an error message: "No video captured. Please record a video or take a photo first."
- **AND** SHALL NOT reference "frames" or "photos" in user-facing messages
