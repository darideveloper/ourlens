## 1. Layout Fix

- [x] 1.1 Add `flex flex-col` to `<main>` element in `src/layouts/Layout.astro:81` when `showNav` is true — the class string changed from `'pt-14 relative flex-1 min-h-0'` to `'pt-14 relative flex-1 min-h-0 flex flex-col'`
- [x] 1.2 Add `flex flex-col` to AuthGuard wrapper div in `src/components/molecules/AuthGuard.tsx` — both the authenticated wrapper (line 39) and the Skeleton div (line 7) need `flex flex-col` to propagate height through Astro's `display: contents` islands
- [x] 1.3 Change CameraScanner outer div from `h-full` to `flex-1 min-h-0` and add `flex flex-col` — the outer div (`relative h-full bg-surface-alt`) changed to `relative flex flex-col flex-1 min-h-0 bg-surface-alt` because `height: 100%` cannot resolve through `display: contents` elements (astro-island/astro-slot have `height: auto`)
- [x] 1.4 Change CameraScanner inner status divs from `h-full` to `flex-1 min-h-0` — the "Starting camera" div (line 85) and "error" div (line 96) changed from `h-full` to `flex-1 min-h-0` so they fill the flex container instead of relying on percentage height

## 2. E2E Test Update

- [x] 2.1 Update `tests/e2e/camera-scanner.spec.ts` to verify the video element has non-zero rendered dimensions when the camera stream is active — added assertion that `page.locator('video')` has a bounding box with `height > 0`

## 3. Manual Verification

- [x] 3.1 All pages respond with HTTP 200 (`/`, `/instructions`, `/report`, `/scanner`)
- [x] 3.2 Camera-scanner e2e test passes
- [x] 3.3 Playwright verification confirms the full height chain: `<main>` = 720px → AuthGuard div = 664px → CameraScanner div = 664px → error/loading div = 664px
- [x] 3.4 Other pages confirmed — `/instructions` and `/report` build correctly; pre-existing test failures unrelated to this change
- [x] 3.5 Homepage `/` unaffected — `<main>` class is empty string when `showNav` is false