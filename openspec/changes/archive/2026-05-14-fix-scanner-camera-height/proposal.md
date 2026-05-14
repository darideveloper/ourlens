# Change: Fix Scanner Camera Height Collapse

## Why
The camera view is invisible when the camera stream starts successfully. The root cause is a broken CSS height chain at multiple levels:

1. `<main>` uses `flex-1` from the body flex column but is NOT a flex container — so AuthGuard's `flex-1 min-h-0` has no effect in block context
2. AuthGuard's wrapper `<div>` is also NOT a flex container — so CameraScanner's children can't use `flex-1` to fill space
3. CameraScanner's outer div uses `h-full` (height: 100%) which cannot resolve through `display: contents` elements (`astro-island`, `astro-slot`) that Astro 6 injects — these elements have `height: auto` which breaks percentage height resolution

The combination means that even after making `<main>` a flex container, the height still didn't propagate through the `display: contents` island wrappers. Playwright testing confirmed that CameraScanner's div was only 261px (content height) instead of the expected 664px.

## What Changes
- Add `flex flex-col` to `<main>` in `Layout.astro` when `showNav` is true
- Add `flex flex-col` to AuthGuard's wrapper div and Skeleton div so height propagates through `display: contents` islands
- Change CameraScanner's outer div from `h-full` to `flex-1 min-h-0 flex flex-col` — percentage height cannot resolve through `display: contents` elements
- Change CameraScanner's inner status divs from `h-full` to `flex-1 min-h-0` — they now live in a flex column and must use flex properties instead of percentage height
- Update the e2e camera test to verify the video element has non-zero rendered dimensions

## Height Chain Analysis

The fix works because the entire chain now uses flex layout instead of percentage height:

1. `<body>` — `flex flex-col min-h-dvh` → flex container, definite height ✅
2. `<nav>` — `fixed top-0` → removed from flow, space via `pt-14` on `<main>` ✅
3. `<main>` — `flex flex-col flex-1 min-h-0 pt-14 relative` → flex child + flex container ✅
4. `<astro-island>` — `display: contents` → transparent, no box ✅
5. AuthGuard `<div>` — `flex-1 min-h-0 flex flex-col` → flex child of `<main>` + flex container for children ✅ (previously `display: block`, now `flex`)
6. `<astro-island>` + `<astro-slot>` — `display: contents` → transparent ✅
7. CameraScanner `<div>` — `flex-1 min-h-0 flex flex-col relative` → flex child of AuthGuard + flex container ✅ (previously `h-full` which couldn't resolve through `display: contents`)
8. Inner status divs — `flex-1 min-h-0` → fill CameraScanner ✅ (previously `h-full`)
9. `<video>` — `absolute inset-0 w-full h-full object-cover` → fills parent ✅

## Key Insight
`height: 100%` (Tailwind's `h-full`) does NOT resolve correctly when `display: contents` elements (astro-island, astro-slot) sit between the element and its containing block with a definite height. The solution is to use flex layout (`flex-1 min-h-0`) throughout the chain, which works regardless of `display: contents` wrappers.

## Impact
- Affected specs: `camera-scanner` (MODIFIED: Camera Access and Live View — adds viewport height scenario)
- Affected code: `src/layouts/Layout.astro`, `src/components/molecules/AuthGuard.tsx`, `src/components/organisms/CameraScanner.tsx`, `tests/e2e/camera-scanner.spec.ts`
- Pages using `<main>` with `showNav` (`/scanner`, `/instructions`, `/report`) will now correctly fill viewport height
- Homepage `/` (no `showNav`) is unaffected — `main` keeps empty class string
- No breaking changes; the fix restores the intended behavior described in the existing spec