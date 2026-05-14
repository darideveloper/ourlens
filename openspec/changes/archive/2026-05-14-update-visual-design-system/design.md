## Context

Ourlens is a mobile-first PWA for elderly home safety scanning. The current UI is functional but visually bare: single-hue blue brand colors, no animations beyond a slow-pulse and flash keyframe, no logo, no navigation chrome, and several undefined CSS tokens (`bg-danger-50`, `bg-safe-50`, `hover:bg-surface-active`). A Web Interface Guidelines audit found ~25 violations. The user has specified three brand colors (#fe676e coral, #febc26 amber, #a5c5d9 sky) on a #fffffe background.

### Constraints
- Budget: $250 USD / 6 weeks (no paid animation libraries)
- Target device: iOS and Android mobile browsers (portrait)
- Users are elderly — WCAG AAA compliance mandatory, tap targets ≥44px, large readable text
- All brand tokens MUST be centralized in `@theme` block in `src/styles/global.css`
- No new runtime dependencies (no Framer Motion, GSAP, etc.)
- Animations must respect `prefers-reduced-motion`

## Goals / Non-Goals

### Goals
- Replace blue brand palette with coral (#fe676e) primary, amber (#febc26) accent, and sky (#a5c5d9) info colors
- Fill all missing CSS token gaps so no undefined classes are referenced
- Add the Ourlens logo to three key screens
- Add tasteful micro-animations and page transitions that enhance UX without distracting elderly users
- Fix all WIG compliance violations (transition-all, missing aria, missing touch-action, etc.)
- Add a lightweight top nav for orientation and back navigation
- Make the UI feel modern, clean, and visually attractive

### Non-Goals
- Dark mode (explicitly out of scope — user requested light theme only)
- New pages or features beyond visual scope (no scan history page, no settings page)
- Backend/API changes
- Adding a custom font (will stay with system-ui for performance and no font-loading CLS)
- Complex animation libraries or WebGL effects

## Decisions

### Decision 1: Color palette generation using OKLCH

Use OKLCH color space to generate 50–900 shades from each brand color hex. This gives perceptually uniform scales that maintain consistent lightness curves.

| Token | Hex | Role |
|---|---|---|
| brand-50..900 | #fe676e base | Primary actions, CTA buttons, links |
| accent-50..900 | #febc26 base | Warnings, highlights, secondary actions |
| info-50..900 | #a5c5d9 base | Informational, tips, muted backgrounds |

Generate each scale by varying L and C in OKLCH while keeping H constant (for the hue). Use https://oklch.com or a script to compute exact values.

Alternatives considered:
- **HSL generation**: Less perceptually uniform — colors at same "lightness" value look different to the eye
- **Manual hex picking**: Time-consuming and inconsistent across scales
- **Tailwind default palette**: Would not match the user's specific brand colors

### Decision 2: CSS-only animations (no JS animation libraries)

All animations will use CSS `@keyframes` defined in the `@theme` block and Tailwind custom animations via `--animate-*` tokens. This keeps bundle size zero and respects `prefers-reduced-motion` via the existing `@media (prefers-reduced-motion: reduce)` block.

New keyframes:
- `fade-in`: opacity 0→1 with translateY
- `slide-up`: translateY(8px)→0 with opacity
- `scale-in`: scale(0.95)→1 with opacity
- `stagger-fade`: wrapper class that delays children by `--stagger-index * 80ms`
- `shimmer`: background-position gradient sweep for skeleton states

Alternatives considered:
- **Framer Motion**: Powerful but adds ~30KB, overkill for micro-animations
- **GSAP**: Commercial license concerns, too heavy
- **Web Animations API**: More control but JS-based, harder to respect reduced motion globally

### Decision 3: Glass-morphism via `backdrop-filter`

Processing overlay, error overlay, PWA banners, and the top nav will use `backdrop-blur-md` + semi-transparent background (`bg-surface/80`) for a modern frosted-glass feel. Testing confirms this works on iOS Safari 15+ and Chrome Android 100+ — the target platforms.

### Decision 4: Navigation bar as Astro layout component

Add a persistent `<nav>` element in `Layout.astro` that shows on authenticated pages. It renders server-side (Astro) for zero hydration cost, using `transition:persist` to avoid re-render on navigation. Back navigation uses `history.back()` via a small inline `<script>`.

### Decision 5: Consolidate HazardCard to single source

The duplicate `HazardCard` in `SafetyReport.tsx` (inline) will be removed in favor of the Astro component `HazardCard.astro`. However, `SafetyReport.tsx` needs HazardCard as a React component (since it's a client-side island). Solution: create a `HazardCard.tsx` React component to replace both the Astro version and the inline one, since the report page is a React island.

## Risks / Trade-offs

| Risk | Severity | Mitigation |
|---|---|---|
| Color contrast may fail WCAG AAA with new coral brand on white background | High | Verify all brand-50/100/500/600 tokens against #fffffe using a contrast checker before merging; adjust L values if needed |
| `backdrop-filter` may cause perf issues on low-end Android devices | Medium | Only use on overlay/nav/overlay components (not scrollable lists); test on Pixel 4a class device |
| Stagger animations could disorient elderly users | Medium | Keep durations ≤300ms, use ease-out curves, and disable entirely with `prefers-reduced-motion` |
| OKLCH color support in older Safari | Low | OKLCH supported in Safari 15.4+, which covers our target (iOS 16+). Include fallback `@supports` if needed, though Tailwind v4 generates OKLCH by default |

## Migration Plan

1. Update `global.css` with new palette and tokens first — this is the foundation
2. Fix undefined token bugs (`bg-danger-50`, `bg-safe-50`, `hover:bg-surface-active`)
3. Add new animation keyframes and utility classes
4. Update `Layout.astro` with `color-scheme`, `touch-action`, `theme-color`, `<link rel="preconnect">`, nav bar, logo
5. Update each component file sequentially (atoms → molecules → organisms → pages)
6. Update `astro.config.mjs` manifest `theme_color` and `background_color`
7. Run `astro build` and verify no missing class warnings
8. Manual visual verification on mobile Safari and Chrome

Rollback: Revert to previous `git` commit — all changes are CSS and template-level.

## Open Questions

- Should the amber accent color (#febc26) be used for danger/warning states, or should we keep a dedicated red for errors? **Recommendation: use coral (#fe676e) as danger, amber (#febc26) as warning/caution, sky (#a5c5d9) as info — semantic colors are derived from brand palette**
- Should the top nav be fixed or scroll-away? **Recommendation: fixed with `backdrop-blur` — feels modern and always accessible**