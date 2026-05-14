## MODIFIED Requirements

### Requirement: Instructional Home Content
The system SHALL provide an Instructional Home screen at `/instructions` with high-contrast, step-by-step instructions explaining how to scan a home for hazards. Body text SHALL use a minimum of 17px (`text-base` in the project's @theme, which maps to 1.0625rem). The screen SHALL display the Ourlens logo at the top. Each instruction step SHALL animate in with a staggered `slide-up` animation (delay based on `--stagger-index * 80ms`, maximum 300ms per step). Step number badges SHALL use a gradient background derived from brand colors. The "Start Scan" CTA button SHALL use a gradient background and `scale-in` animation.

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

### Requirement: Accessibility of Instructions
The Instructional Home screen SHALL use body text at minimum 17px, high-contrast colors (WCAG AAA: 7:1 minimum for body text), and simple language appropriate for elderly users. Headings SHALL use `text-wrap: balance`.

#### Scenario: Text legibility on Instructional Home
- **WHEN** the Instructional Home screen is rendered
- **THEN** body text SHALL be at least 17px (`text-base`)
- **AND** all text SHALL meet WCAG AAA contrast ratio (7:1 minimum for body text, 4.5:1 for large text)
- **AND** language SHALL be simple and action-oriented
- **AND** headings SHALL use `text-wrap: balance`