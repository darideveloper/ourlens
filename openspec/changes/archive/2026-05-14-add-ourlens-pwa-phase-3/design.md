## Context

Phase 1 and Phase 2 established the foundation, layout, route protection, and API layer. This phase implements the core camera scanning experience — the primary interactive feature that differentiates Ourlens from a static web page. Users access the camera via WebRTC, capture frames during a 3-second recording, and prepare them for AI analysis (which happens in Phase 4).

## Goals / Non-Goals

### Goals
- Enable rear-camera access via `getUserMedia` with graceful fallback for devices without rear camera
- Implement frame extraction: 4 frames over 3 seconds via `canvas.drawImage`, resize to 1024px, JPEG 0.7 quality, Base64 encoding
- Handle camera permission denied, timeout, and stream recovery (iOS Safari backgrounding)
- Create reusable camera hooks and pure helper functions

### Non-Goals
- AI analysis and frame submission (deferred to Phase 4)
- Processing overlay UI (deferred to Phase 4)
- Safety report display (deferred to Phase 4)

## Decisions

### Snapshot Strategy over Video Upload

- **Decision:** Extract 4 frames from live camera stream during a 3-second recording via `canvas.drawImage()`, resize to 1024px, compress to JPEG 0.7, send as Base64 JSON array
- **Alternatives considered:** Upload full video (~50MB), single photo capture, streaming frames via WebSocket, MediaRecorder with post-processing
- **Rationale:** Live frame extraction is reliable on iOS Safari (unlike `video.currentTime` + `seeked` which is unreliable on Safari blobs). Keeps payload small (~1.6MB total), avoids crashing n8n, provides multiple angles for AI analysis. Uses `requestAnimationFrame` for frame-accurate timing.

### Camera Access Best Practices

- **Decision:** Use `{ facingMode: { ideal: 'environment' } }` for rear camera with `OverconstrainedError` fallback to `{ video: true }`, 10s `AbortSignal.timeout` on `getUserMedia`, `visibilitychange` handler for iOS stream recovery
- **Rationale:** Rear camera preferred for home scanning. `ideal` allows graceful fallback. iOS Safari freezes streams when backgrounded — the `visibilitychange` handler detects dead tracks and restarts the camera.

```ts
const startCamera = async (): Promise<MediaStream> => {
  try {
    return await Promise.race([
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new DOMException('Timeout', 'TimeoutError')), 10000)
      ),
    ]);
  } catch (err) {
    if ((err as DOMException).name === 'OverconstrainedError') {
      return navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }
    throw err;
  }
};
```

### Processing is NOT a Separate Route

- **Decision:** The processing overlay is shown within the Scanner page (not `/processing`). The CameraScanner component manages the overlay state.
- **Rationale:** Navigating away would kill the camera stream and lose state. The overlay is shown conditionally within the same route.

### Zustand Camera Store (NOT Persisted)

- **Decision:** Use a non-persisted Zustand store for camera stream state, recording status, and frame extraction. Use transient `subscribe` for the `MediaStream` object to avoid React re-renders on stream reference changes.
- **Rationale:** Camera stream data cannot be serialized to localStorage. Transient subscriptions prevent unnecessary re-renders when the stream reference changes.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| iOS Safari WebRTC restrictions | "Add to Home Screen" prompt (Phase 2) + `visibilitychange` stream recovery + HTTPS requirement |
| Camera permission UX varies across browsers | Graceful error states with "Try Again" button and clear messaging |
| `OverconstrainedError` on devices without rear camera | Fallback to `{ video: true, audio: false }` with any available camera |

## Open Questions

- None specific to this phase.