## MODIFIED Requirements

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