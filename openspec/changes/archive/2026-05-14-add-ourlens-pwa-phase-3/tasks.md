## Phase 3: Camera Scanner (React Island)

- [x] 3.1 Create `src/stores/use-camera-store.ts` — Zustand store (NOT persisted) for camera stream state, recording status, and frame extraction; uses transient `subscribe` for stream (avoid React re-renders on `MediaStream`)
- [x] 3.2 Create `src/hooks/useCamera.ts` — React hook handling `getUserMedia` with `{ facingMode: { ideal: 'environment' } }`, 10s `AbortSignal.timeout`, `OverconstrainedError` fallback, `visibilitychange` handler for iOS stream recovery, cleanup on unmount
- [x] 3.3 Create `src/hooks/useFrameExtractor.ts` — React hook for canvas-based live frame extraction: `requestAnimationFrame` + `setTimeout(750ms)` timing, resize to 1024px with staged downscaling, JPEG 0.7 quality, Base64 conversion, canvas memory cleanup
- [x] 3.4 Create `src/lib/camera.ts` — pure helper functions: `processFrame()` (resize + compress + Base64), `extractFrame()` (canvas draw from `<video>`), `getRearCameraStream()` with error classification
- [x] 3.5 Create atom: `src/components/atoms/IconButton.tsx` — React icon button for camera controls, 44px minimum
- [x] 3.6 Create molecule: `src/components/molecules/CameraView.tsx` — React component wrapping `<video>` with `autoPlay playsInline muted`, transient stream subscription
- [x] 3.7 Create molecule: `src/components/molecules/CameraControls.tsx` — Capture (photo) and Record (3s video) buttons with loading/disabled states
- [x] 3.8 Create organism: `src/components/organisms/CameraScanner.tsx` — React island (`client:load`, `transition:persist`) orchestrating CameraView + CameraControls + frame extraction + Zustand camera store
- [x] 3.9 Add camera permission denied state with user-friendly error message and "Try Again" button
- [x] 3.10 Add camera timeout state (10s) with retry button
- [x] 3.11 Wire `src/pages/scanner.astro` to render CameraScanner as `client:load` with `transition:persist="scanner"`
- [x] 3.12 Playwright test: navigate to scanner page, camera permission state renders, capture button exists, UI is accessible (tap targets >= 44px, contrast ratios pass)
