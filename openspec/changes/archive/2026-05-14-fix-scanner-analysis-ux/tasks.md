## 1. Terminology — Hide Frame Extraction from Users

- [x] 1.1 Update `ProcessingOverlay.tsx` — change `STATUS_MESSAGES` from `uploading: 'Sending photos...'` to `uploading: 'Uploading video...'` and `analyzing: 'Analyzing your home...'` to `analyzing: 'Analyzing video...'`
- [x] 1.2 Update `ProcessingOverlay.tsx` — remove the text "This may take a moment. Your camera stays active during analysis." from the overlay body
- [x] 1.3 Update `useAnalysis.ts` — change error message from `'No frames captured. Please capture some photos first.'` to `'No video captured. Please record a video or take a photo first.'`

## 2. Submit Button — Reposition and Guard

- [x] 2.1 Update `CameraScanner.tsx` — move the "Analyze video" button from `top-16` to `bottom-24`, positioned above the CameraControls (`bottom-8`); style as a full-width bar with `rounded-accessible` and `shadow-lg`
- [x] 2.2 Update `CameraScanner.tsx` — change the button visibility condition from `frames.length > 0 && !isAnalyzing` to `status === 'ready' && frames.length > 0 && !isAnalyzing` to prevent showing during recording or capturing

## 3. Overlay Readability — Make Fully Opaque

- [x] 3.1 Update `ProcessingOverlay.tsx` — change overlay background from `bg-white/90 backdrop-blur-sm` to `bg-surface` (fully opaque, no blur)
- [x] 3.2 Verify text contrast on `bg-surface` meets WCAG AAA (7:1 for body, 4.5:1 for large text)

## 4. Camera Stream Management — Stop During Analysis

- [x] 4.1 Update `useCamera.ts` — extract a `stopStream()` function that calls `stopStreamTracks(streamRef.current)` and `releaseVideoElement(videoRef.current)`, resets `streamRef`, and sets `startRequestedRef` to false; return `stopStream` from the hook
- [x] 4.2 Update `useAnalysis.ts` — accept a `stopCamera` callback prop; call it immediately after `startAnalysis()` in the `analyze` function
- [x] 4.3 Update `CameraScanner.tsx` — pass `stopStream` from `useCamera` to `useAnalysis` (or call `stopStream()` in the `analyze` wrapper before delegating); on `cancel()`, reset camera store status to `'idle'` via `useCameraStore.reset()` to trigger camera re-acquisition
- [x] 4.4 Update `useAnalysis.cancel()` — after resetting analysis state, also set camera store status to `'idle'` so the camera re-starts when returning to scanner (alternatively, the "Scan Again" button on the report page already navigates away and the scanner remounts)

## 5. Validation

- [x] 5.1 Manual verification: record a 3-second video → "Recording" badge appears at top → recording ends → "Analyze video" button appears at bottom, no overlap
- [x] 5.2 Manual verification: tap "Analyze video" → opaque overlay with "Uploading video..." → "Analyzing video..." → navigates to report; no visible camera feed behind overlay
- [x] 5.3 Manual verification: tap "Cancel" during analysis → overlay dismisses → camera stream restarts
- [x] 5.4 Manual verification: error state → "Try Again" works and restarts camera