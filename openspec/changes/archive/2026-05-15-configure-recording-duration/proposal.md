# Change: Configure Recording Duration via Environment Variable

## Why

Recording duration and frame rate are currently hardcoded constants in `useFrameExtractor.ts`. Adjusting them for testing or production tuning requires a code change and redeploy. Exposing the duration as a `PUBLIC_` env var makes it a deployment-time setting with no code changes needed.

## What Changes

- **NEW env var** `PUBLIC_RECORD_DURATION_SECONDS` (integer, default `3`) controls recording length.
- **Frame rate fixed at 1 fps** (`FRAME_INTERVAL = 1000 ms`) — replaces the current 0.75 s interval. Frames captured = duration in seconds (e.g., 3 s → 3 frames, 10 s → 10 frames).
- `src/hooks/useFrameExtractor.ts` derives `RECORD_DURATION` from the env var instead of a hardcoded literal.
- `src/components/molecules/CameraControls.tsx` button label reads the same env value so it always reflects the configured duration (e.g., "Record 3-second video", "Record 10-second video").
- **Remaining time display** — while recording is active, the camera screen shows a live countdown of the remaining seconds (e.g. "Recording… 2s left"). The label updates every second until the recording stops. This reuses the same `RECORD_DURATION` value; no additional env var is needed.
- `.env` gains `PUBLIC_RECORD_DURATION_SECONDS=3` with a comment.
- OpenSpec `camera-scanner` spec updated to describe env-var-driven duration, 1 fps behaviour, and the remaining-time UI.

## Impact

- **Affected specs:** `camera-scanner`
- **Affected code:**
  - `src/hooks/useFrameExtractor.ts` — `RECORD_DURATION`, `FRAME_INTERVAL` constants (lines 5–6)
  - `src/components/molecules/CameraControls.tsx` — button label string (line 44) and new countdown display during recording
  - `.env` — new env var entry
  - `.env.example` — new env var entry (documents the var for new developers)
- **No breaking changes** — default value of `3` preserves current behaviour (duration), but frame count changes from 4 → 3 at the 3 s default (1 fps vs current ~1.33 fps)
