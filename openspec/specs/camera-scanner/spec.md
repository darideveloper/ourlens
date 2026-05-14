# camera-scanner Specification

## Purpose
TBD - created by archiving change add-ourlens-pwa-phase-3. Update Purpose after archive.
## Requirements
### Requirement: Camera Access and Live View
The Camera Scanner SHALL access the device camera via `navigator.mediaDevices.getUserMedia` with `{ facingMode: { ideal: 'environment' } }` for the rear camera and render a live video preview as a React island component with `client:load` and `transition:persist`. The camera view SHALL include `touch-action: manipulation` on the video element to prevent double-tap zoom delay. A subtle gradient overlay SHALL appear at the bottom of the camera view to improve contrast for the controls. The layout hierarchy from `<body>` through `<main>` to the camera component SHALL use flex layout at every level (not percentage-based height) to ensure height propagation works through Astro's `display: contents` island wrappers. The `<main>` element, the AuthGuard wrapper, and the CameraScanner outer div SHALL all be `flex flex-col` containers. Inner status divs (loading, error) SHALL use `flex-1 min-h-0` instead of `h-full` to fill the flex container.

#### Scenario: Camera permission granted
- **WHEN** user navigates to the Scanner screen and grants camera permission
- **THEN** the system SHALL display a live camera preview filling the viewport
- **AND** SHALL show Capture (photo) and Record (3-second video) controls
- **AND** SHALL start the rear-facing camera with `facingMode: { ideal: 'environment' }`
- **AND** SHALL display a subtle gradient overlay at the bottom for control contrast

#### Scenario: Camera permission denied
- **WHEN** user denies camera permission
- **THEN** the system SHALL display a user-friendly error message explaining how to enable camera access
- **AND** SHALL provide a "Try Again" button
- **AND** SHALL NOT crash or show a blank screen

#### Scenario: Camera permission timeout
- **WHEN** `getUserMedia` does not respond within 10 seconds
- **THEN** the system SHALL display a "Camera did not respond" error message with a retry button
- **AND** SHALL abort the camera request via `AbortSignal.timeout`

#### Scenario: Overconstrained camera fallback
- **WHEN** the requested rear camera constraints are not available on the device
- **THEN** the system SHALL fall back to `{ video: true, audio: false }` and use any available camera

#### Scenario: iOS Safari stream recovery
- **WHEN** the app returns from the background on iOS Safari
- **THEN** the system SHALL check if camera tracks are still `live` via `visibilitychange` event
- **AND** SHALL restart the camera if tracks are dead

#### Scenario: Camera preview fills available viewport height
- **WHEN** the camera stream starts successfully on a page with the top navigation bar
- **THEN** the `<main>` element SHALL be a flex column container allowing its children to stretch to fill the viewport
- **AND** the AuthGuard wrapper SHALL be a flex column container (`flex-1 min-h-0 flex flex-col`) so height propagates through Astro's `display: contents` island wrappers
- **AND** the CameraScanner outer div SHALL use `flex-1 min-h-0` (not `h-full`) to participate in the flex column
- **AND** the `<video>` element SHALL have non-zero rendered dimensions (bounding box height > 0)
- **AND** the live camera preview SHALL be visible and fill the available space

### Requirement: Snapshot Frame Extraction
The Camera Scanner SHALL implement live frame extraction from the camera stream: during a 3-second recording, extract frames every 0.75 seconds using `canvas.drawImage(video)` and `requestAnimationFrame`, resize to 1024px width maintaining aspect ratio, compress to JPEG at 0.7 quality, and convert to Base64 strings. The user SHALL NOT see references to internal frame extraction; all user-facing labels SHALL present the flow as "record video → analyze video". After recording or capture completes and frames exist, the system SHALL show an "Analyze video" button with a gradient background (`bg-gradient-to-r from-brand-500 to-accent-500`) at the bottom of the screen (above the camera controls), only when the camera status is `ready`. The button SHALL NOT appear during active recording or capturing states. The "Recording" indicator SHALL use a glow-pulse animation (`animate-pulse-slow` with `ring-2 ring-danger-500`).

#### Scenario: User records a 3-second video
- **WHEN** user taps the Record button
- **THEN** the system SHALL extract 4 frames from the live `<video>` stream (one every 0.75 seconds)
- **AND** SHALL resize each frame to 1024px width maintaining aspect ratio
- **AND** SHALL compress each frame to JPEG at 0.7 quality
- **AND** SHALL return an array of 4 Base64-encoded JPEG strings
- **AND** SHALL NOT display "Analyze video" button during the recording
- **AND** SHALL display a "Recording" indicator with glow-pulse animation
- **AND** SHALL display "Analyze video" button with gradient background after recording completes (camera status returns to `ready`)

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

### Requirement: Camera Stream Cleanup
The system SHALL stop all camera tracks and release the media stream when the Camera Scanner component unmounts, when the app goes to the background, and when analysis begins (since the camera stream is no longer needed after frames are captured). The system SHALL restart the camera stream when the user returns from analysis (via "Scan Again" or cancel).

#### Scenario: User navigates away from Scanner
- **WHEN** user navigates away from the Camera Scanner screen
- **THEN** the system SHALL call `stop()` on all media stream tracks
- **AND** SHALL null the `video.srcObject` and call `video.load()` to release resources
- **AND** the camera indicator light on the device SHALL turn off

#### Scenario: Analysis begins
- **WHEN** the user submits frames for analysis (taps "Analyze video")
- **THEN** the system SHALL stop all camera stream tracks immediately after analysis starts
- **AND** SHALL release the video element
- **AND** the device camera indicator light SHALL turn off during analysis

#### Scenario: User returns to scanner after analysis
- **WHEN** the user taps "Scan Again" from the report screen or cancels an in-progress analysis
- **THEN** the system SHALL set the camera store status to `idle`
- **AND** the `useCamera` hook SHALL re-acquire the camera stream automatically
- **AND** the live camera preview SHALL be displayed again

