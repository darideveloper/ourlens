## Context

The scanner-to-analysis flow has three UX problems discovered after Phase 4 implementation: leaked implementation terminology ("photos", "frames"), submit button overlapping the "Recording" badge, and an overlay that is hard to read because the camera video bleeds through a semi-transparent background. The ProcessingOverlay was designed to stay within the Scanner page to preserve camera stream state, but this creates a readability problem when the video feed is visible behind the progress text.

## Goals / Non-Goals

### Goals
- Hide internal video-to-image conversion from the user; present the entire flow as "record video → analyze video"
- Fix the "Analyze video" button position so it never overlaps with the "Recording" badge
- Make the processing overlay fully opaque so text is always readable
- Stop the camera stream during analysis to save battery/CPU (the stream is useless once frames are captured)

### Non-Goals
- Auto-submit after recording (the user still wants explicit control via the "Analyze video" button)
- Changing the recording duration or frame extraction interval
- Modifying the n8n API contract or error handling
- Changing the Safety Report page

## Decisions

### Button Relocated to Bottom Bar

- **Decision:** Move the "Analyze video" button from `top-16` to `bottom-24` (above the CameraControls at `bottom-8`), positioned as a full-width bar. Only show it when `status === 'ready' && frames.length > 0 && !isAnalyzing`.
- **Alternatives considered:**
  - Auto-submit after recording: Cleaner flow but removes user control; user explicitly requested keeping a submit button.
  - Top-right floating action button: Unconventional for mobile-first apps; thumb reach is poor.
  - Hide button during `recording` status only: Works but still risks overlap in capture state.
- **Rationale:** Bottom positioning is natural for thumb reach on mobile. Guarding with `status === 'ready'` ensures the button never appears during recording or capturing. The `bottom-24` position places it above CameraControls with clear visual separation.

### Opaque Overlay Instead of Semi-Transparent

- **Decision:** Change ProcessingOverlay background from `bg-white/90 backdrop-blur-sm` to `bg-surface` (fully opaque). Remove the "Your camera stays active during analysis" text.
- **Alternatives considered:**
  - Darker overlay on top of video (e.g. `bg-black/80`): Changes the mood to dark/somber, not aligned with the app's bright, accessible brand.
  - Keep semi-transparent with higher opacity (`bg-white/95`): Still slightly see-through, still hard to read with video movement.
- **Rationale:** Full opacity completely eliminates the readability problem. Since the camera stream is stopped during analysis anyway (see next decision), there's nothing to show through the overlay.

### Stop Camera Stream During Analysis

- **Decision:** After analysis starts, stop all camera tracks via `stopStreamTracks()`. Restart the camera on "Scan Again" or cancel by setting the camera store status back to `idle`, which triggers `useCamera`'s effect to re-acquire the stream.
- **Alternatives considered:**
  - Keep camera running: Wastes battery/CPU, creates visual noise behind overlay, no benefit since frames are already captured.
  - Pause video element only (`video.pause()`): Doesn't release the stream; camera indicator stays on.
- **Rationale:** The camera stream serves no purpose once frames are extracted. Stopping it saves resources and eliminates the camera indicator light staying on. The existing `useCamera` effect already handles re-acquiring the stream when `status === 'idle'`.

### Terminology: "Video" Not "Photos"

- **Decision:** All user-facing strings refer to "video" throughout the flow. Internal variable names (`frames`, `processFrame`, etc.) remain unchanged since they're implementation details. Only the UI copy changes.
- **Rationale:** Users record a video, not "take photos that get converted to frames". The terminology should match the user's mental model.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Camera restart on cancel/Scan Again may fail on some devices | Existing `useCamera` hook already handles restart via `visibilitychange` and error recovery; same paths apply |
| Users may wonder where camera went during analysis | Opaque overlay with "Analyzing video..." is self-explanatory; no camera indicator confusion |
| Slightly longer flow (tap Record → tap Analyze) vs auto-submit | Preserves user control; auto-submit can be added in a future change if user research confirms preference |

## Migration Plan

1. Add `stopStream()` to `useCamera` hook return value
2. Call `stopStream()` from `useAnalysis.analyze()` after `startAnalysis()`
3. Update `useAnalysis.cancel()` to reset camera status to `idle` (triggers re-acquisition)
4. Update ProcessingOverlay background and copy
5. Move submit button position and guard condition
6. Update error message copy

Rollback: Restore each file individually; no database or API changes involved.

## Open Questions

- None