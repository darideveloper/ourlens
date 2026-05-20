# visual-design-system Delta Specification

## Modified Requirements

### Requirement: Brand Color Palette
The `warning` color tokens SHALL be used semantically to represent "Medium" risk hazards in the UI.

#### Scenario: Medium risk color mapping
- **WHEN** a "Medium" risk hazard is rendered
- **THEN** the system SHALL use `warning` color tokens for its background, borders, and badges
- **AND** SHALL ensure WCAG AAA contrast for text on `warning-500` backgrounds
