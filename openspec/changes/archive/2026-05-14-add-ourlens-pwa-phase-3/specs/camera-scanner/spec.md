## ADDED Requirements

### Requirement: Camera Access and Live View
The Camera Scanner SHALL access the device camera via `navigator.mediaDevices.getUserMedia` with `{ facingMode: { ideal: 'environment' } }` for the rear camera and render a live video preview as a React island component with `client:load` and `transition:persist`.

#### Scenario: Camera permission granted
- **WHEN** user navigates to the Scanner screen and grants camera permission
- **THEN** the system SHALL display a live camera preview filling the viewport
- **AND** SHALL show Capture (photo) and Record (3-second video) controls
- **AND** SHALL start the rear-facing camera with `facingMode: { ideal: 'environment' }`

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

### Requirement: Snapshot Frame Extraction
The Camera Scanner SHALL implement live frame extraction from the camera stream: during a 3-second recording, extract frames every 0.75 seconds using `canvas.drawImage(video)` and `requestAnimationFrame`, resize to 1024px width maintaining aspect ratio, compress to JPEG at 0.7 quality, and convert to Base64 strings.

#### Scenario: User records a 3-second video
- **WHEN** user taps the Record button
- **THEN** the system SHALL extract 4 frames from the live `<video>` stream (one every 0.75 seconds)
- **AND** SHALL resize each frame to 1024px width maintaining aspect ratio
- **AND** SHALL compress each frame to JPEG at 0.7 quality
- **AND** SHALL return an array of 4 Base64-encoded JPEG strings

#### Scenario: User captures a single photo
- **WHEN** user taps the Capture button
- **THEN** the system SHALL capture a single frame from the current camera view via `canvas.drawImage`
- **AND** SHALL resize the frame to 1024px width
- **AND** SHALL compress to JPEG at 0.7 quality
- **AND** SHALL return an array containing 1 Base64-encoded JPEG string

### Requirement: Camera Stream Cleanup
The system SHALL stop all camera tracks and release the media stream when the Camera Scanner component unmounts or when the app goes to the background.

#### Scenario: User navigates away from Scanner
- **WHEN** user navigates away from the Camera Scanner screen
- **THEN** the system SHALL call `stop()` on all media stream tracks
- **AND** SHALL null the `video.srcObject` and call `video.load()` to release resources
- **AND** the camera indicator light on the device SHALL turn off