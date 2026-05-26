## MODIFIED Requirements

### Requirement: Invitation Code Validation
The system SHALL provide an Access Control screen where users enter an invitation code and submit it for validation against the n8n backend via `safeFetch` POST request. On successful validation, the code SHALL be stored in the Zustand session store with persist middleware (`skipHydration: true`). When validation fails (either invalid code response or network error), the system SHALL explicitly set `isValid` to `false` to maintain consistent authentication state. When the backend returns an invalid code response, the system SHALL display the error message: "That invitation code is not recognised or expired. Please check and try again."

#### Scenario: Valid invitation code submitted
- **WHEN** user enters a valid invitation code and submits the form
- **THEN** the system SHALL call `validateCode()` from `src/lib/api/validate-code.ts`
- **AND** on a successful validation response, store the code in the session store via persist middleware
- **AND** navigate to `/instructions` via `navigate('/instructions', { history: 'replace' })`

#### Scenario: Invalid invitation code submitted
- **WHEN** user enters an invalid invitation code and submits the form
- **THEN** the system SHALL display the error message: "That invitation code is not recognised or expired. Please check and try again."
- **AND** the system SHALL set `isValid` to `false` in the session store
- **AND** the user SHALL remain on the Access Control screen

#### Scenario: Network error during validation
- **WHEN** user submits the form and the `safeFetch` request throws a `FetchError` of type `network` or `timeout`
- **THEN** the system SHALL display a user-friendly error message appropriate to the error type
- **AND** the system SHALL set `isValid` to `false` in the session store
- **AND** allow the user to retry

#### Scenario: Concurrent validation attempts prevented
- **WHEN** user attempts to submit the form while a validation request is already in progress
- **THEN** the system SHALL ignore the additional submission attempt
- **AND** the "Verify Code" button SHALL remain disabled during validation
