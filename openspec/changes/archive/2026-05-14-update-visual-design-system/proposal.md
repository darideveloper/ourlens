# Change: Modernize Visual Design System with Brand Colors, Animations, and UI Polish

## Why

The current UI has a minimal, functional aesthetic with bland blue brand colors, almost no visual effects or animations, undefined CSS tokens referenced in components, and the Ourlens logo unused anywhere in the app. A Web Interface Guidelines audit identified ~25 compliance issues (undefined classes, missing `transition-property` specificity, missing `aria-` attributes, missing `prefers-reduced-motion` guards, missing `touch-action`, missing `type` attributes). The product needs a cohesive, modern visual identity using the user-specified brand colors (#fe676e, #febc26, #a5c5d9) on a #fffffe background that feels attractive and professional for elderly users.

## What Changes

- **Replace the entire color token system** in `src/styles/global.css` from blue-based brand colors to the three brand colors (#fe676e coral, #febc26 amber, #a5c5d9 sky) with full 50–900 palette scales, plus an updated surface/semantic system on #fffffe background
- **Add missing CSS tokens**: `--color-danger-50`, `--color-safe-50`, `--color-surface-active`, `--shadow-card`, `--shadow-elevated`, `--shadow-modal`, animation keyframes (`fade-in`, `slide-up`, `scale-in`, `stagger-fade`), and `font-variant-numeric: tabular-nums` utility
- **Add `<html color-scheme="light">` and `<meta name="theme-color">` matching #fffffe** to `Layout.astro`
- **Add `touch-action: manipulation`** on `<body>` in `Layout.astro`
- **Add `<link rel="preconnect">`** for the API domain in `Layout.astro`
- **Integrate the Ourlens logo** (`/ourlens-logo.png`) on Access Control, Instructional Home, and Safety Report screens with explicit `width`/`height` and `alt` attributes
- **Add visual effects and animations**: gradient hero backgrounds on Access Control, staggered fade-in-up for instruction steps, animated counters on hazard counts, scale-in transitions for CTAs, shimmer loading skeletons, glass-morphism on overlays, gradient progress bar, glow-pulse on record button, success animation on EmptyReport, page view transitions, ripple micro-interactions on buttons
- **Add `text-wrap: balance`** on headings, `font-variant-numeric: tabular-nums` on numeric displays
- **Fix all Web Interface Guidelines violations**: replace `transition-all` with specific properties, add `spellCheck={false}` on code input, change placeholder to end with ellipsis character, use specific button labels, add `overscroll-behavior: contain` on modals, add `aria-live` on error containers, replace `bg-white` hardcodes with `bg-surface` tokens, consolidate duplicate HazardCard components, add `prefers-reduced-motion` guards on icon-button scale effect, replace three-dot `...` with proper ellipsis `…` character in all loading/status messages, remove dead code (`HazardCard.astro` and `RiskBadge.astro`)
- **Add a persistent top navigation bar** with logo, page title, and back navigation across all authenticated screens
- **Implement skeleton loading states** for report, instructions, and camera loading states
- **Modernize PWA banners** (OfflineIndicator, IosInstallBanner, PWAUpdatePrompt) with slide-in animations, icons, and updated brand styling
- **Update PWA manifest `theme_color` and `background_color`** to match #fffffe and brand-500

## Impact

- Affected specs: `frontend-accessibility`, `instructional-home`, `access-control`, `safety-report`, `processing-overlay`, `pwa-infrastructure`, `camera-scanner`
- Affected code: `src/styles/global.css`, `src/layouts/Layout.astro`, all components in `src/components/`, `astro.config.mjs` (manifest colors)
- **BREAKING**: The entire color palette changes — all `bg-brand-*`, `text-brand-*`, `border-brand-*` class usages will render with new coral-based colors instead of blue. This is intentional and desired.
- This change does NOT alter any business logic, API contracts, or data models