## MODIFIED Requirements

### Requirement: Safety Report Display
The system SHALL display a Safety Report page showing the list of hazards identified by the AI, each with a hazard name, risk level badge (Low/High), and actionable recommendation. The report SHALL read scan data from the Zustand scan store using a hydration-safe hook. The report header SHALL display the Ourlens logo. Hazard cards SHALL have shadow styling (`shadow-card hover:shadow-elevated`) and stagger-animate in with `slide-up` effect. Hazard counts SHALL use `tabular-nums` for numeric alignment. The "No Hazards Detected" empty state SHALL include an animated success checkmark with spring effect.

#### Scenario: Report with multiple hazards
- **WHEN** the AI analysis returns multiple hazards
- **THEN** the system SHALL render a Safety Report page with the Ourlens logo in the header
- **AND** each hazard SHALL be displayed as a card with `shadow-card` and `hover:shadow-elevated` styling
- **AND** hazards with "High" risk level SHALL be visually prominent (`danger-500` color with `contrast-more:border-2`)
- **AND** hazards with "Low" risk level SHALL use a subdued indicator (`safe-500` color)
- **AND** hazard cards SHALL animate in with staggered `slide-up` effect
- **AND** hazard counts SHALL use `tabular-nums` for numeric alignment

#### Scenario: Report with no hazards found
- **WHEN** the AI analysis returns an empty list of hazards
- **THEN** the system SHALL display a "No hazards detected" message with an animated success checkmark
- **AND** SHALL include a "Scan Again" button with gradient background
- **AND** the success checkmark SHALL have a spring/scale animation effect

#### Scenario: Zustand store hydration delay
- **WHEN** the Safety Report page renders before the persist middleware has rehydrated from localStorage
- **THEN** the system SHALL show a skeleton loading state matching the report card layout (gray rectangles for heading, text, badges) with `shimmer` animation
- **AND** SHALL display the full report once hydration completes
- **AND** skeletons SHALL be disabled when `prefers-reduced-motion: reduce` is active