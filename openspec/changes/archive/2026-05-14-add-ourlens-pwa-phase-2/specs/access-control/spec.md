## ADDED Requirements

### Requirement: Invitation Code Validation
The system SHALL provide an Access Control screen where users enter an invitation code and submit it for validation against the n8n backend via `safeFetch` POST request. On successful validation, the code SHALL be stored in the Zustand session store with persist middleware (`skipHydration: true`).

#### Scenario: Valid invitation code submitted
- **WHEN** user enters a valid invitation code and submits the form
- **THEN** the system SHALL call `validateCode()` from `src/lib/api/validate-code.ts`
- **AND** on a successful validation response, store the code in the session store via persist middleware
- **AND** navigate to `/instructions` via `navigate('/instructions', { history: 'replace' })`

#### Scenario: Invalid invitation code submitted
- **WHEN** user enters an invalid invitation code and submits the form
- **THEN** the system SHALL display an error message indicating the code is invalid
- **AND** the user SHALL remain on the Access Control screen

#### Scenario: Network error during validation
- **WHEN** user submits the form and the `safeFetch` request throws a `FetchError` of type `network` or `timeout`
- **THEN** the system SHALL display a user-friendly error message appropriate to the error type
- **AND** allow the user to retry

### Requirement: Access Control UI
The Access Control screen SHALL display a branded heading, a single text input for the invitation code, and a submit button with large tap targets (minimum 44px / `min-h-tap min-w-tap`) suitable for elderly users.

#### Scenario: Access Control screen rendered
- **WHEN** the application loads
- **THEN** the Access Control screen SHALL be the first screen displayed at `/`
- **AND** SHALL contain a heading, an invitation code input field, and a submit button
- **AND** all interactive elements SHALL meet minimum 44px tap target size
- **AND** the input field SHALL have a visible focus indicator (`focus-visible:ring-4`)