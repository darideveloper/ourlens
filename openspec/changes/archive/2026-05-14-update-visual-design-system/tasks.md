## 1. Design Token Foundation

- [x] 1.1 Generate OKLCH color scales (50–900) from brand colors #fe676e (coral/primary), #febc26 (amber/accent), #a5c5d9 (sky/info) and update `src/styles/global.css` `@theme` block, replacing all `--color-brand-*` tokens and adding `--color-accent-*`, `--color-info-*` tokens
- [x] 1.2 Update `--color-surface` to `#fffffe` and adjust `--color-surface-alt`, `--color-on-surface`, `--color-on-surface-muted` for proper contrast against the new surface
- [x] 1.3 Add missing CSS tokens: `--color-danger-50`, `--color-danger-600`, `--color-safe-50`, `--color-surface-active` (now defined from new palette)
- [x] 1.4 Add shadow tokens: `--shadow-card`, `--shadow-elevated`, `--shadow-modal` with appropriate OKLCH values
- [x] 1.5 Add animation keyframes: `fade-in`, `slide-up`, `scale-in`, `stagger-fade`, `shimmer` in `@theme` with corresponding `--animate-*` tokens
- [x] 1.6 Add `font-variant-numeric: tabular-nums` utility class (`tabular-nums` custom utility)
- [x] 1.7 Add `text-wrap: balance` utility styles for headings via `@layer base`
- [x] 1.8 Add `--color-danger-*` tokens derived from #fe676e and `--color-safe-*` tokens derived from #a5c5d9 mixed with green, plus `--color-warning-*` tokens derived from #febc26

## 2. Layout and HTML Head Fixes

- [x] 2.1 Update `src/layouts/Layout.astro`: add `color-scheme: light` style on `<html>` element
- [x] 2.2 Update `src/layouts/Layout.astro`: change `<meta name="theme-color">` content to `#fffffe`
- [x] 2.3 Update `src/layouts/Layout.astro`: add `style="touch-action: manipulation"` on `<body>`
- [x] 2.4 Update `src/layouts/Layout.astro`: add `<link rel="preconnect" href="${API_BASE_URL}">` for the n8n API domain (read from env)
- [x] 2.5 Update `src/layouts/Layout.astro`: add persistent top navigation bar component with logo image, page title, and back button
- [x] 2.6 Update `src/layouts/Layout.astro`: add `text-wrap: balance` on heading elements via global CSS rule

## 3. Component Atom Fixes

- [x] 3.1 `IconButton.tsx`: replace `transition-all` with `transition-[transform,background-color,color]` and wrap `active:scale-95` in `motion-safe:active:scale-95`
- [x] 3.2 `Spinner.tsx`: change `aria-label="Loading"` to `aria-label="Loading…"`
- [x] 3.3 `Input.astro`: add `spellcheck` and `aria-label` props, default aria-label to name
- [x] 3.4 `OfflineIndicator.tsx`: add slide-down enter animation, update styling with brand colors, add icon
- [x] 3.5 `IosInstallBanner.tsx`: add Logo component/icon inside banner, update styling with glass-morphism
- [x] 3.6 `PWAUpdatePrompt.tsx`: glass-morphism styling (`backdrop-blur-md bg-surface/80`), brand gradient, animate-slide-up
- [x] 3.7 `Button.astro`: add gradient primary variant, `hover:shadow-elevated`, `motion-safe:active:scale-[0.98]`, `transition-[transform,background]`

## 4. Molecule Fixes

- [x] 4.1 `ProcessingOverlay.tsx`: replace `transition-all duration-150` with `transition-[width] duration-150 ease-out`
- [x] 4.2 `ProcessingOverlay.tsx`: fix `hover:bg-surface-active` → replace with `hover:bg-surface-alt/70`
- [x] 4.3 `ProcessingOverlay.tsx`: replace `bg-white/95` with `bg-surface/80 backdrop-blur-md` for glass-morphism (both ProcessingOverlay and ErrorOverlay)
- [x] 4.4 `ProcessingOverlay.tsx`: add `overscroll-behavior: contain` CSS on both dialog containers
- [x] 4.5 `ProcessingOverlay.tsx`: add `tabular-nums` class on progress percentage display
- [x] 4.6 `ProcessingOverlay.tsx`: add gradient fill on progress bar (`bg-gradient-to-r from-brand-500 to-accent-400`)
- [x] 4.7 `CodeForm.tsx`: add `spellCheck={false}`, placeholder `"e.g. 4821…"`, button label `"Verify Code"`, gradient button
- [x] 4.8 `AuthGuard.tsx`: replace plain `<Spinner>` with skeleton loading state using `shimmer-bg`
- [x] 4.9 `CameraView.tsx`: add `touch-action: manipulation` style on video element
- [x] 4.10 `CameraControls.tsx`: add glow-pulse animation on record button (`ring-2 ring-danger-500 animate-pulse-slow`)

## 5. Organism Redesigns

- [x] 5.1 `AccessControl.tsx`: add logo, gradient background (`bg-gradient-to-b from-brand-50 to-surface`), `animate-fade-in`
- [x] 5.2 `InstructionalHome.astro`: add staggered animation on steps (`animate-stagger-fade`), add logo, gradient step badges
- [x] 5.3 `SafetyReport.tsx`: create React `HazardCard.tsx` in atoms with `shadow-card hover:shadow-elevated`, remove `HazardCard.astro` and `RiskBadge.astro`
- [x] 5.4 `SafetyReport.tsx`: add `animate-fade-in` on header, `tabular-nums` on hazard counts, gradient "Scan Again" button, logo, stagger cards
- [x] 5.5 `EmptyReport`: add `animate-scale-in` on checkmark SVG, gradient "Scan Again" button
- [x] 5.6 `CameraScanner.tsx`: replace `bg-white/80` with `bg-surface/80`, add `overscroll-behavior: contain`, canvas `width`/`height`, `aria-live="assertive"` on error container, ellipsis on "Starting camera…"
- [x] 5.7 `CameraScanner.tsx`: add gradient overlay at bottom of camera view, update "Analyze video" button to gradient primary, gradient "Try Again" button

## 6. Page-Level Updates

- [x] 6.1 `offline.astro`: replace inline `onclick` with proper button + `<script>`, gradient brand styling, offline icon
- [x] 6.2 View transitions: already have `transition:animate` on `<main>` in Layout.astro; global CSS `prefers-reduced-motion` disables all animations

## 7. Configuration Updates

- [x] 7.1 Update `astro.config.mjs`: change `theme_color` from `#ffffff` to `#fffffe`, change `background_color` from `#ffffff` to `#fffffe`
- [x] 7.2 Verify all `--color-brand-*` usages render correctly with new coral palette (run `astro build` and check for console warnings about undefined utilities)

## 8. Web Interface Guidelines Fixes

- [x] 8.1 Add `aria-label` to `Input.astro` (defaults to `name` prop)
- [x] 8.2 Add `aria-live="polite"` on ProcessingOverlay status message container
- [x] 8.3 Add `aria-live="assertive"` on CameraScanner error state container
- [x] 8.4 Add `scroll-margin-top` on heading anchors in global CSS (via `heading-anchor` utility)
- [x] 8.5 Review all `transition` usages — no `transition: all` or `transition-all` exists in any component
- [x] 8.6 ProcessingOverlay status container has `aria-live="polite"`, ErrorOverlay message has `aria-live="assertive"`
- [x] 8.7 Replace all three-dot ellipsis (`...`) with proper ellipsis character (`…`): ProcessingOverlay, CameraScanner, ReportPage
- [x] 8.8 Remove unused `@custom-variant dark` line from `src/styles/global.css`

## 9. Verification

- [x] 9.1 Run `astro build` and verify zero build warnings for undefined CSS tokens
- [x] 9.2 Run `astro dev` and manually verify each page renders with new brand colors, animations work, and logo appears
- [x] 9.3 Test with `prefers-reduced-motion: reduce` in browser DevTools — verify all animations stop gracefully
- [x] 9.4 Test contrast ratios of all text against backgrounds using browser accessibility inspector — verify WCAG AAA (7:1 body, 4.5:1 large)
- [ ] 9.5 Test on mobile Safari (iOS 16+) and Chrome Android — verify backdrop-blur, animations, and touch targets
- [ ] 9.6 Run accessibility audit (Lighthouse or axe) — verify zero violations

## 10. Bug Fixes Found During Verification

- [x] 10.1 Fix React "Invalid hook call" errors: change `client:load`/`client:idle` to `client:only="react"` for browser-only components (OfflineIndicator, PWAUpdatePrompt, IosInstallBanner in Layout.astro; CameraScanner in scanner.astro)
- [x] 10.2 Fix nav logo tap target: add `min-h-tap min-w-tap` classes to "Ourlens home" link in Layout.astro (was 28x28, now 44x44)