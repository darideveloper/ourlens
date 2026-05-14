# Spec Delta: instructional-home

## MODIFIED Requirements

### Requirement: Instructional Home Content

The system SHALL provide an Instructional Home screen at `/instructions` with high-contrast, step-by-step instructions explaining how to scan a home for hazards. Body text SHALL use a minimum of 17px (`text-base` in the project's @theme, which maps to 1.0625rem). The screen SHALL display the Ourlens logo at the top. Each instruction step SHALL animate in with a staggered `slide-up` animation (delay based on `--stagger-index * 80ms`, maximum 300ms per step). Step number badges SHALL use a gradient background derived from brand colors. The "Start Scan" CTA button SHALL use a gradient background and `scale-in` animation. The top navigation back button SHALL be disabled on this screen because there is no previous authenticated screen to navigate back to. The back button SHALL use the HTML `disabled` attribute, which prevents clicks, removes the button from the tab order, and communicates the disabled state to assistive technology natively. The disabled button SHALL display with `opacity-30` and `cursor-default` styling to visually indicate it is not interactive.

#### Scenario: Instructional Home screen displayed

- **WHEN** a user has successfully validated their invitation code
- **THEN** the system SHALL display the Instructional Home screen
- **AND** the screen SHALL contain the Ourlens logo at the top with explicit `width` and `height` attributes and `alt="Ourlens"`
- **AND** SHALL contain clear, step-by-step instructions with high-contrast text and gradient step badges
- **AND** SHALL include a prominent "Start Scan" call-to-action button with `min-h-tap min-w-tap` and gradient background
- **AND** each step SHALL animate in with staggered `slide-up` effect on initial render

#### Scenario: Start Scan action

- **WHEN** user taps the "Start Scan" button
- **THEN** the system SHALL navigate to `/scanner` via `navigate('/scanner')`

#### Scenario: Instructional animations with reduced motion

- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** step animations SHALL be disabled and steps SHALL render immediately without stagger

#### Scenario: Disabled back button on Instructions screen

- **WHEN** the Instructional Home screen is displayed at `/instructions`
- **THEN** the top navigation bar back button SHALL have the HTML `disabled` attribute
- **AND** the back button SHALL display with `opacity-30` and `cursor-default` styling to visually indicate it is not interactive
- **AND** the back button SHALL NOT respond to hover (`hover:text-on-surface` shall be removed when disabled)
- **AND** the back button SHALL NOT navigate anywhere when activated