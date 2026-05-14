# Spec Delta: visual-design-system

## MODIFIED Requirements

### Requirement: Top Navigation Bar

The Layout SHALL include a persistent top navigation bar on authenticated pages (instructions, scanner, report) that displays the Ourlens logo, current page title, and a back navigation button. The nav bar SHALL use `backdrop-filter: blur` with semi-transparent background (`bg-surface/80 backdrop-blur-md`) for a modern glass-morphism effect. The nav bar SHALL be fixed at the top of the viewport and SHALL use `transition:persist` to avoid re-rendering across Astro view transitions. The back button SHALL be disabled on the `/instructions` page because there is no previous authenticated screen to navigate back to. On other authenticated pages (`/scanner`, `/report`), the back button SHALL remain fully functional and navigate to the previous page via `history.back()`.

#### Scenario: Navigation bar on authenticated pages

- **WHEN** a user navigates to `/instructions`, `/scanner`, or `/report`
- **THEN** a fixed top navigation bar SHALL be visible showing the Ourlens logo, page title, and a back button
- **AND** on `/scanner` and `/report`, the back button SHALL navigate to the previous page via `history.back()`

#### Scenario: Navigation bar hidden on Access Control

- **WHEN** a user is on the Access Control screen at `/`
- **THEN** the top navigation bar SHALL NOT be displayed

#### Scenario: Back button disabled on Instructions screen

- **WHEN** a user is on the Instructional Home screen at `/instructions`
- **THEN** the back button in the navigation bar SHALL have the HTML `disabled` attribute
- **AND** the back button SHALL display with `opacity-30` and `cursor-default` to visually indicate it is not interactive
- **AND** the back button SHALL NOT navigate anywhere when activated