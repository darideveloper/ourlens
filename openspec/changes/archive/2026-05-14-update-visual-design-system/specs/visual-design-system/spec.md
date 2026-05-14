## ADDED Requirements

### Requirement: Brand Color Palette
All brand and semantic colors SHALL be defined as `@theme` tokens in `src/styles/global.css` using the OKLCH color space with full 50–900 scales. The primary brand color SHALL be derived from #fe676e (coral), the accent color from #febc26 (amber), and the info color from #a5c5d9 (sky). The surface/background SHALL be #fffffe. Danger tokens SHALL be derived from the coral brand color; safe/success tokens from the sky color blended with green; warning tokens from the amber accent color. All color tokens SHALL meet WCAG AAA contrast ratios against the surface background when used for text or interactive elements.

#### Scenario: Color palette renders brand colors
- **WHEN** any screen is rendered
- **THEN** `bg-brand-500` SHALL render as coral (#fe676e approximately)
- **AND** `bg-accent-500` SHALL render as amber (#febc26 approximately)
- **AND** `bg-info-500` SHALL render as sky (#a5c5d9 approximately)
- **AND** `bg-surface` SHALL render as #fffffe
- **AND** all text using `text-on-surface` or `text-on-surface-muted` SHALL meet WCAG AAA contrast ratios against `bg-surface`

#### Scenario: Color palette centralization
- **WHEN** a developer changes `--color-brand-*`, `--color-accent-*`, or `--color-info-*` values in `src/styles/global.css`
- **THEN** all components using those token-based classes SHALL reflect the change globally
- **AND** no other files SHALL need modification for a color rebrand

### Requirement: Design Token Completeness
The `@theme` block in `src/styles/global.css` SHALL define all tokens referenced by any component in the codebase, including: `--color-danger-50`, `--color-danger-600`, `--color-danger-500/30`, `--color-safe-50`, `--color-safe-500/30`, `--color-surface-active`, `--shadow-card`, `--shadow-elevated`, `--shadow-modal`. No component SHALL reference a CSS class or token that is undefined in the theme.

#### Scenario: No undefined CSS tokens
- **WHEN** any component references a design token such as `bg-danger-50`, `bg-safe-50`, or `hover:bg-surface-active`
- **THEN** the corresponding token SHALL be defined in the `@theme` block
- **AND** `astro build` SHALL produce zero warnings about undefined utilities

### Requirement: Animation System
The application SHALL define CSS keyframe animations in the `@theme` block for: `fade-in` (opacity 0→1 with translateY 8px→0), `slide-up` (translateY 16px→0 with opacity), `scale-in` (scale 0.95→1 with opacity), `stagger-fade` (delayed fade-in based on `--stagger-index`), and `shimmer` (background-position gradient sweep). All animations and transitions SHALL respect `prefers-reduced-motion: reduce` by providing static alternatives. No component SHALL use `transition: all` or `transition-all` — specific properties SHALL be listed explicitly.

#### Scenario: Staggered animation on instruction steps
- **WHEN** the Instructional Home screen renders with `prefers-reduced-motion` unset
- **THEN** each step `<li>` SHALL animate with a delayed `slide-up` effect (delay = `--stagger-index * 80ms`)
- **AND** the total animation duration per step SHALL not exceed 300ms

#### Scenario: Animation with reduced motion
- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** all component animations SHALL be disabled or static
- **AND** view transitions SHALL use `transition:animate="none"`
- **AND** stagger effects SHALL render immediately without delay

### Requirement: Ourlens Logo Integration
The Ourlens logo (`/ourlens-logo.png`) SHALL be displayed on the Access Control screen, the Instructional Home screen, and the Safety Report screen header. The `<img>` element SHALL include explicit `width` and `height` attributes and a descriptive `alt="Ourlens"` attribute.

#### Scenario: Logo on Access Control screen
- **WHEN** the Access Control screen renders at `/`
- **THEN** the Ourlens logo SHALL appear above the "Welcome to Ourlens" heading
- **AND** the `<img>` element SHALL have explicit `width` and `height` attributes
- **AND** the `<img>` element SHALL have `alt="Ourlens"`

#### Scenario: Logo on Instructional Home screen
- **WHEN** the Instructional Home screen renders at `/instructions`
- **THEN** the Ourlens logo SHALL appear at the top of the page
- **AND** the `<img>` element SHALL have explicit `width` and `height` attributes

#### Scenario: Logo on Safety Report screen
- **WHEN** the Safety Report screen renders at `/report`
- **THEN** the Ourlens logo SHALL appear in the report header
- **AND** the `<img>` element SHALL have explicit `width` and `height` attributes

### Requirement: Top Navigation Bar
The Layout SHALL include a persistent top navigation bar on authenticated pages (instructions, scanner, report) that displays the Ourlens logo, current page title, and a back navigation button. The nav bar SHALL use `backdrop-filter: blur` with semi-transparent background (`bg-surface/80 backdrop-blur-md`) for a modern glass-morphism effect. The nav bar SHALL be fixed at the top of the viewport and SHALL use `transition:persist` to avoid re-rendering across Astro view transitions.

#### Scenario: Navigation bar on authenticated pages
- **WHEN** a user navigates to `/instructions`, `/scanner`, or `/report`
- **THEN** a fixed top navigation bar SHALL be visible showing the Ourlens logo, page title, and a back button
- **AND** the back button SHALL navigate to the previous page via `history.back()`

#### Scenario: Navigation bar hidden on Access Control
- **WHEN** a user is on the Access Control screen at `/`
- **THEN** the top navigation bar SHALL NOT be displayed

### Requirement: Typography Enhancements
All `<h1>` through `<h3>` headings SHALL use `text-wrap: balance` to prevent widowed words. Numeric displays (progress percentages, hazard counts, step numbers) SHALL use `font-variant-numeric: tabular-nums` to maintain consistent column alignment.

#### Scenario: Heading text balance
- **WHEN** a heading containing multiple words wraps across lines
- **THEN** `text-wrap: balance` SHALL distribute words across lines to avoid widowed words

#### Scenario: Numeric alignment in report
- **WHEN** hazard counts or progress percentages are displayed
- **THEN** the font SHALL use `tabular-nums` for consistent character widths

### Requirement: Glass-Morphism Overlays
The Processing overlay, Error overlay, PWA update prompt, and iOS install banner SHALL use a modern frosted-glass effect with `backdrop-blur-md` and semi-transparent background (`bg-surface/80`). All modal-like overlays SHALL include `overscroll-behavior: contain` to prevent background scrolling.

#### Scenario: Processing overlay glass effect
- **WHEN** the Processing overlay is displayed during analysis
- **THEN** the overlay background SHALL use `bg-surface/80 backdrop-blur-md`
- **AND** the overlay SHALL have `overscroll-behavior: contain` to prevent background scroll

#### Scenario: Error overlay glass effect
- **WHEN** the Error overlay is displayed
- **THEN** the overlay background SHALL use `bg-surface/80 backdrop-blur-md`

### Requirement: Skeleton Loading States
When data is loading (report loading, instruction page loading, camera starting), the system SHALL display skeleton loading placeholders (gray pulsing rectangles matching the layout of the expected content) instead of a bare `<Spinner>` component alone. Skeletons SHALL use the `shimmer` animation for a gradient sweep effect and SHALL respect `prefers-reduced-motion`.

#### Scenario: Report loading skeleton
- **WHEN** the Safety Report page is loading before hydration completes
- **THEN** the system SHALL display skeleton placeholders matching the report card layout (gray rectangles for heading, text, badges)
- **AND** skeletons SHALL use the `shimmer` animation
- **AND** skeletons SHALL be disabled when `prefers-reduced-motion: reduce` is active

#### Scenario: Camera starting skeleton
- **WHEN** the Camera Scanner is in `starting` or `idle` state
- **THEN** the system MAY show a subtle skeleton placeholder instead of a bare spinner

### Requirement: Gradient Elements
Primary call-to-action buttons, the instruction step number badges, the progress bar fill, and the Access Control screen background SHALL use CSS gradients derived from brand colors for visual appeal. All gradients SHALL maintain WCAG AAA text contrast where text is overlaid. Gradients SHALL not use `transition: all`.

#### Scenario: CTA button gradient
- **WHEN** a primary CTA button is rendered (e.g., "Verify Code", "Start Scan", "Analyze video", "Scan Again")
- **THEN** the button background SHALL use `bg-gradient-to-r from-brand-500 to-brand-600` or similar
- **AND** text on the button SHALL meet 4.5:1 contrast ratio

#### Scenario: Instruction step badges
- **WHEN** the Instructional Home step number badges are rendered
- **THEN** each badge SHALL use a gradient background (`bg-gradient-to-br from-brand-500 to-accent-400`)
- **AND** text on the badge SHALL be white

#### Scenario: Progress bar gradient fill
- **WHEN** the processing progress bar is animating
- **THEN** the fill SHALL use `bg-gradient-to-r from-brand-500 to-accent-400`