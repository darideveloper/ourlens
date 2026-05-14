# frontend-accessibility Specification

## Purpose
TBD - created by archiving change add-ourlens-pwa-phase-1. Update Purpose after archive.
## Requirements
### Requirement: Color Contrast and Typography
All UI elements SHALL meet WCAG AAA contrast ratios: 7:1 minimum for body text, 4.5:1 minimum for large text (18px+ or 14px+ bold), and 3:1 minimum for UI components and graphical objects. Body text SHALL use a minimum of 17px (1.0625rem). All brand colors SHALL be defined as `@theme` tokens in `src/styles/global.css` for centralized branding updates.

#### Scenario: Text contrast compliance
- **WHEN** any screen is rendered
- **THEN** body text (`text-base` at 17px) SHALL meet 7:1 contrast ratio against its background
- **AND** large text SHALL meet 4.5:1 contrast ratio
- **AND** all interactive elements SHALL meet 3:1 contrast ratio against adjacent colors

#### Scenario: Branding update
- **WHEN** a developer changes `--color-brand-*` values in `src/styles/global.css`
- **THEN** all components using `bg-brand-*`, `text-brand-*`, and `border-brand-*` classes SHALL reflect the change globally
- **AND** no other files SHALL need modification for a color rebrand

### Requirement: Skip-to-Content Link
The base Layout SHALL include a skip-to-content link as the first focusable element, visible only on focus (`sr-only focus:not-sr-only`), allowing keyboard users to bypass navigation.

#### Scenario: Keyboard user tabs into page
- **WHEN** a keyboard user presses Tab on page load
- **THEN** a "Skip to main content" link SHALL become visible and focused
- **AND** pressing Enter SHALL move focus to the `#main-content` landmark

### Requirement: Tap Target Sizes
All interactive elements (buttons, links, inputs, checkboxes) SHALL have a minimum tap target size of 44px (`min-h-tap min-w-tap` using the `--spacing-tap: 2.75rem` token). Inline links SHALL use negative margins to expand the tap area without affecting layout.

#### Scenario: Button tap target
- **WHEN** a button is rendered
- **THEN** the interactive area SHALL be at least 44px × 44px
- **AND** the button SHALL include `focus-visible:ring-4 focus-visible:ring-brand-500/30` for keyboard focus indication

#### Scenario: Input tap target
- **WHEN** a text input is rendered
- **THEN** the input height SHALL be at least 44px (`h-tap`)
- **AND** the input SHALL include `focus:border-brand-500 focus:ring-4 focus:ring-brand-500/30` for focus indication

### Requirement: Focus Management
All interactive elements SHALL have visible focus indicators using `focus-visible:` variants with a minimum 2px outline and 3px ring. Focus SHALL never be trapped without an escape mechanism.

#### Scenario: Keyboard focus on interactive element
- **WHEN** an interactive element receives keyboard focus
- **THEN** the element SHALL display `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500`
- **AND** SHALL display `focus-visible:ring-4 focus-visible:ring-brand-500/30`

### Requirement: High Contrast Mode Support
All components SHALL enhance visibility when the OS high-contrast setting is active, using `contrast-more:` Tailwind variants for borders, text weight, and backgrounds.

#### Scenario: High contrast mode enabled
- **WHEN** the OS high-contrast setting is active
- **THEN** all borders SHALL become more visible (`contrast-more:border-2 contrast-more:border-on-surface`)
- **AND** muted text SHALL gain full contrast (`contrast-more:text-on-surface`)
- **AND** all focus indicators SHALL remain visible

### Requirement: Reduced Motion Support
All animations and transitions SHALL respect the `prefers-reduced-motion` media query. When reduced motion is preferred, animations SHALL be replaced with static alternatives using `motion-reduce:` Tailwind variants.

#### Scenario: Processing overlay animation with reduced motion
- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** the processing overlay progress animation SHALL be static (`motion-reduce:animate-none`)
- **AND** page transitions SHALL use `transition:animate="none"` at root level

#### Scenario: Processing overlay animation without reduced motion
- **WHEN** the user does not have `prefers-reduced-motion: reduce` enabled
- **THEN** the processing overlay SHALL show a slow pulse animation (`animate-pulse-slow`)

### Requirement: Comprehensive Accessibility Audit
All components SHALL be audited and enhanced for WCAG AAA compliance: ARIA labels on all interactive elements, logical focus management, keyboard navigation support, 7:1 contrast ratios for body text, 4.5:1 for large text, and `prefers-reduced-motion` support for page transitions.

#### Scenario: Keyboard navigation across all screens
- **WHEN** a user navigates the application using only keyboard
- **THEN** all interactive elements SHALL be reachable via Tab
- **AND** focus order SHALL follow a logical reading sequence
- **AND** focus SHALL never be trapped without an escape mechanism

#### Scenario: ARIA labels on interactive elements
- **WHEN** an interactive element is rendered
- **THEN** it SHALL have appropriate `aria-label` or `aria-labelledby` attributes
- **AND** icon-only buttons SHALL have descriptive `aria-label` attributes

#### Scenario: View transitions with reduced motion
- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** page transitions SHALL use `transition:animate="none"` at the root level
- **AND** all component animations SHALL respect the preference

