## ADDED Requirements

### Requirement: Educational-tool and local-processing disclaimer

The CodeForm SHALL render a disclaimer paragraph immediately after the consent checkbox and before the submit button. The disclaimer SHALL communicate that OurLens is an educational hazard-awareness tool, is not a substitute for professional advice / safety assessments / regulatory compliance reviews, and that data is processed locally on your device and is not stored by OurLens.

#### Scenario: Disclaimer is visible below the consent checkbox
- **WHEN** the user views the Access Control screen
- **THEN** the user SHALL see a disclaimer paragraph positioned below the consent checkbox and above the "Verify Code" button
- **AND** the paragraph SHALL include the text `OurLens™`
- **AND** the paragraph SHALL state that the tool is educational and not a substitute for professional advice, safety assessments, or regulatory compliance reviews
- **AND** the paragraph SHALL state that data is processed locally on your device and is not stored by OurLens

#### Scenario: Disclaimer is not part of the checkbox accessible name
- **WHEN** a screen reader or accessibility tool reads the consent checkbox
- **THEN** the checkbox's accessible name SHALL remain the existing terms & conditions sentence
- **AND** the disclaimer SHALL be announced as a separate paragraph after the checkbox

#### Scenario: Disclaimer does not block form submission
- **WHEN** the user has entered a valid invitation code and checked the consent checkbox
- **THEN** the "Verify Code" button SHALL be enabled regardless of disclaimer visibility
- **AND** the disclaimer SHALL remain visible after a validation error
