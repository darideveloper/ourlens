# safety-report Delta Specification

## Modified Requirements

### Requirement: Safety Report Display
The system SHALL display "Medium" risk hazards with a distinct visual indicator. The report summary SHALL include a count of Medium risks when present.

#### Scenario: Report with Medium hazards
- **WHEN** the AI analysis returns hazards with "Medium" risk level
- **THEN** the system SHALL render a summary banner for Medium risks using `warning-50` background and `warning-700` text
- **AND** hazards with "Medium" risk level SHALL use the `warning-500` color for their badge
- **AND** the count of Medium risks SHALL be displayed using `tabular-nums`
