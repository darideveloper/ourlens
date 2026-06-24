## ADDED Requirements

### Requirement: Access Control tagline copy

The Access Control screen SHALL display the tagline `AI-powered safety scanner for peace of mind.` as a paragraph element directly under the "Welcome to Ourlens" heading.

#### Scenario: Tagline rendered on Access Control screen
- **WHEN** the Access Control screen is rendered at `/`
- **THEN** the screen SHALL show a paragraph below the "Welcome to Ourlens" heading
- **AND** the paragraph SHALL contain exactly the text `AI-powered safety scanner for peace of mind.`
- **AND** the paragraph SHALL NOT contain the word `home`

#### Scenario: Tagline text regression
- **WHEN** a developer or build pipeline inspects the rendered HTML of the Access Control screen
- **THEN** the tagline SHALL be the string `AI-powered safety scanner for peace of mind.` (no `home` qualifier)
