# Change: Phase 3 — Camera Scanner (React Island)

## Why

This phase implements the core scanning experience: live camera access via WebRTC with rear-camera preference, frame extraction using `canvas.drawImage` every 0.75s during 3s recording, camera permission error handling, and iOS Safari stream recovery. This is the primary interactive feature that differentiates Ourlens from a static web page.

## What Changes

- **Camera Zustand store:** `use-camera-store.ts` (NOT persisted) for camera stream state, recording status, and frame extraction
- **React hooks:** `useCamera.ts` (getUserMedia with `facingMode: { ideal: 'environment' }`, 10s timeout, OverconstrainedError fallback, visibilitychange handler), `useFrameExtractor.ts` (canvas-based frame extraction with requestAnimationFrame + setTimeout timing, resize to 1024px, JPEG 0.7, Base64)
- **Camera helpers:** `src/lib/camera.ts` — pure functions for `processFrame()`, `extractFrame()`, `getRearCameraStream()` with error classification
- **Atomic component:** `IconButton.tsx` — React icon button for camera controls, 44px minimum
- **Molecular components:** `CameraView.tsx` (live `<video>` wrapper), `CameraControls.tsx` (Capture and Record buttons)
- **Organism:** `CameraScanner.tsx` — orchestrates CameraView + CameraControls + frame extraction + Zustand camera store with `client:load` and `transition:persist`
- **Page wiring:** `scanner.astro` renders CameraScanner as `client:load` with `transition:persist="scanner"`

## Impact

- Affected specs: camera-scanner
- Affected code: `src/stores/use-camera-store.ts`, `src/hooks/useCamera.ts`, `src/hooks/useFrameExtractor.ts`, `src/lib/camera.ts`, `src/components/atoms/IconButton.tsx`, `src/components/molecules/CameraView.tsx`, `src/components/molecules/CameraControls.tsx`, `src/components/organisms/CameraScanner.tsx`, `src/pages/scanner.astro`
- **Prerequisites:** Phase 1 (foundation, routes), Phase 2 (AuthGuard, session store)
- **Depended on by:** Phase 4 (processing overlay and API submission)