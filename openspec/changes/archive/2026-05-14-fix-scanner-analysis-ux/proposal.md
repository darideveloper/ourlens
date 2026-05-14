# Change: Fix Scanner Analysis UX — Terminology, Layout & Readability

## Why

Three UX issues degrade the scanner-to-analysis flow: (1) internal frame-extraction terminology ("photos", "frames", "Sending photos...") leaks into the user-facing UI, exposing implementation details; (2) the "Analyze video" button appears at `top-16` and can overlap with the "Recording" badge at `top-4` during active recording, creating visual clutter; (3) during analysis, the camera stream stays active behind a semi-transparent overlay (`bg-white/90`), making text hard to read — especially with a moving video feed bleeding through.

## What Changes

- **UI terminology:** Replace all user-facing references to "photos" and "frames" with "video" language. ProcessingOverlay status messages changed from `"Sending photos..."` to `"Uploading video..."` and `"Analyzing your home..."` to `"Analyzing video..."`. Error message in `useAnalysis` changed from `"No frames captured. Please capture some photos first."` to `"No video captured. Please record a video or take a photo first."`.
- **Button positioning:** Move the "Analyze video" submit button from `top-16` to `bottom-24` (above CameraControls at `bottom-8`) and only show it when camera status is `ready` (not during recording or capturing). The button now appears as a persistent bottom bar when frames exist, eliminating overlap with the "Recording" badge.
- **Overlay readability:** Change ProcessingOverlay background from semi-transparent `bg-white/90 backdrop-blur-sm` to fully opaque `bg-surface`. Remove the "Your camera stays active during analysis" hint text, as it draws attention to the camera.
- **Camera stream management:** Stop camera tracks during analysis (after frames are captured) and restart on "Scan Again" or cancel, saving battery and CPU. The `useCamera` hook exposes a `stop()` method and the `useAnalysis` hook calls it after `startAnalysis()`.

## Impact

- Affected specs: camera-scanner (MODIFIED: Snapshot Frame Extraction, Camera Stream Cleanup), processing-overlay (MODIFIED: Processing State Display)
- Affected code: `CameraScanner.tsx`, `ProcessingOverlay.tsx`, `useAnalysis.ts`, `useCamera.ts`, `use-analysis-store.ts`
- **Prerequisites:** Phase 4 (processing overlay, analysis hook, scan report) must be archived first so `specs/processing-overlay/spec.md` exists before this change's MODIFIED delta can be applied