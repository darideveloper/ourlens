## 1. Environment Variable

- [x] 1.1 Add `PUBLIC_RECORD_DURATION_SECONDS=3` to `.env` with a one-line comment describing valid values (positive integer, seconds).

## 2. Frame Extractor Hook

- [x] 2.1 In `src/hooks/useFrameExtractor.ts`, replace the hardcoded `RECORD_DURATION = 3_000` with a value derived from `import.meta.env.PUBLIC_RECORD_DURATION_SECONDS` (parse as integer, multiply by 1000; fallback to `3000` if absent or invalid).
- [x] 2.2 Replace `FRAME_INTERVAL = 750` with `FRAME_INTERVAL = 1_000` (fixed 1 fps).

## 3. Camera Controls UI

- [x] 3.1 In `src/components/molecules/CameraControls.tsx`, replace the static `"Record 3-second video"` label with a dynamic string that reads `PUBLIC_RECORD_DURATION_SECONDS` (e.g., `Record ${duration}-second video`).
- [x] 3.2 In `src/components/molecules/CameraControls.tsx`, while `isRecording` is true, show a live countdown label (e.g. "Recording… 2s left") that decrements every second using a `useEffect`/`setInterval` driven by the configured duration value passed as a prop.

## 4. Validation

- [x] 4.1 Run the dev server and navigate to `/scanner`.
- [x] 4.2 Record a video and confirm recording stops after the configured duration, the button label matches, and the countdown ticks from N down to 0 during recording.
- [x] 4.3 Change `PUBLIC_RECORD_DURATION_SECONDS` to `10` in `.env`, restart dev server, and confirm recording runs for 10 seconds with 10 frames captured and countdown starts at 10.
- [x] 4.4 Remove the env var from `.env` and confirm the fallback of 3 seconds works correctly.
