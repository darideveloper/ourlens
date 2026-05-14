## MODIFIED Requirements

### Requirement: Color Contrast and Typography
All UI elements SHALL meet WCAG AAA contrast ratios: 7:1 minimum for body text, 4.5:1 minimum for large text (18px+ or 14px+ bold), and 3:1 minimum for UI components and graphical objects. Body text SHALL use a minimum of 17px (1.0625rem). All brand colors SHALL be defined as `@theme` tokens in `src/styles/global.css` for centralized branding updates. The primary brand palette SHALL be derived from #fe676e (coral), the accent palette from #febc26 (amber), and the info palette from #a5c5d9 (sky), with the surface background set to #fffffe. All `<h1>` through `<h3>` headings SHALL use `text-wrap: balance`. Numeric displays SHALL use `font-variant-numeric: tabular-nums`.

#### Scenario: Text contrast compliance
- **WHEN** any screen is rendered
- **THEN** body text (`text-base` at 17px) SHALL meet 7:1 contrast ratio against its background
- **AND** large text SHALL meet 4.5:1 contrast ratio
- **AND** all interactive elements SHALL meet 3:1 contrast ratio against adjacent colors
- **AND** all color tokens SHALL meet WCAG AAA contrast against `#fffffe` background when used for text

#### Scenario: Branding update
- **WHEN** a developer changes `--color-brand-*` values in `src/styles/global.css`
- **THEN** all components using `bg-brand-*`, `text-brand-*`, and `border-brand-*` classes SHALL reflect the change globally
- **AND** no other files SHALL need modification for a color rebrand

#### Scenario: Heading text balance
- **WHEN** a heading wraps across lines
- **THEN** `text-wrap: balance` SHALL prevent widowed words

#### Scenario: Numeric tabular alignment
- **WHEN** numbers are displayed in columns or comparisons (hazard counts, progress percentages)
- **THEN** the font SHALL use `tabular-nums` for consistent alignment

### Requirement: Comprehensive Accessibility Audit
All components SHALL be audited and enhanced for WCAG AAA compliance: ARIA labels on all interactive elements, logical focus management, keyboard navigation support, 7:1 contrast ratios for body text, 4.5:1 for large text, `prefers-reduced-motion` support for page transitions, `touch-action: manipulation` on `<body>`, `color-scheme: light` on `<html>`, `overscroll-behavior: contain` on modal overlays, and `spellcheck="false"` on code-type inputs.

#### Scenario: Keyboard navigation across all screens
- **WHEN** a user navigates the application using only keyboard
- **THEN** all interactive elements SHALL be reachable via Tab
- **AND** focus order SHALL follow a logical reading sequence
- **AND** focus SHALL never be trapped without an escape mechanism

#### Scenario: ARIA labels on interactive elements
- **WHEN** an interactive element is rendered
- **THEN** it SHALL have appropriate `aria-label` or `aria-labelledby` attributes
- **AND** icon-only buttons SHALL have descriptive `aria-label` attributes
- **AND** form inputs SHALL have associated `<label>` elements or `aria-label`
- **AND** code-type inputs SHALL have `spellcheck="false"`
- **AND** loading states and status messages SHALL use the ellipsis character `…` (U+2026) instead of three dots `...`

#### Scenario: View transitions with reduced motion
- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** page transitions SHALL use `transition:animate="none"` at the root level
- **AND** all component animations SHALL be disabled or static
- **AND** no `transition: all` or `transition-all` SHALL be used in any component

#### Scenario: Touch interaction
- **WHEN** any screen is rendered on a touch device
- **THEN** `<body>` SHALL have `touch-action: manipulation` to prevent double-tap zoom delay
- **AND** modal overlays SHALL have `overscroll-behavior: contain` to prevent background scroll

#### Scenario: HTML color scheme
- **WHEN** the application renders
- **THEN** the `<html>` element SHALL include `class="light"` with `color-scheme: light` CSS property
- **AND** `<meta name="theme-color">` SHALL match the surface background (`#fffffe`)