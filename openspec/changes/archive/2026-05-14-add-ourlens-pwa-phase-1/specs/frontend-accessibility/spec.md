## ADDED Requirements

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