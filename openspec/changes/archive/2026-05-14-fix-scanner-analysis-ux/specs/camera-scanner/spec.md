## MODIFIED Requirements

### Requirement: Snapshot Frame Extraction
The Camera Scanner SHALL implement live frame extraction from the camera stream: during a 3-second recording, extract frames every 0.75 seconds using `canvas.drawImage(video)` and `requestAnimationFrame`, resize to 1024px width maintaining aspect ratio, compress to JPEG at 0.7 quality, and convert to Base64 strings. The user SHALL NOT see references to internal frame extraction; all user-facing labels SHALL present the flow as "record video → analyze video". After recording or capture completes and frames exist, the system SHALL show an "Analyze video" button at the bottom of the screen (above the camera controls), only when the camera status is `ready`. The button SHALL NOT appear during active recording or capturing states.

#### Scenario: User records a 3-second video
- **WHEN** user taps the Record button
- **THEN** the system SHALL extract 4 frames from the live `<video>` stream (one every 0.75 seconds)
- **AND** SHALL resize each frame to 1024px width maintaining aspect ratio
- **AND** SHALL compress each frame to JPEG at 0.7 quality
- **AND** SHALL return an array of 4 Base64-encoded JPEG strings
- **AND** SHALL NOT display "Analyze video" button during the recording
- **AND** SHALL display "Analyze video" button at the bottom of the screen after recording completes (camera status returns to `ready`)

#### Scenario: User captures a single photo
- **WHEN** user taps the Capture button
- **THEN** the system SHALL capture a single frame from the current camera view via `canvas.drawImage`
- **AND** SHALL resize the frame to 1024px width
- **AND** SHALL compress to JPEG at 0.7 quality
- **AND** SHALL return an array containing 1 Base64-encoded JPEG string
- **AND** SHALL display "Analyze video" button at the bottom of the screen after capture completes (camera status returns to `ready`)

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