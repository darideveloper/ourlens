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

