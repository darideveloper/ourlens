## MODIFIED Requirements
### Requirement: Invitation Code Validation
The system SHALL provide an Access Control screen where users enter an invitation code and submit it for validation against the n8n backend via `safeFetch` POST request. On successful validation, the code SHALL be stored in the Zustand session store with persist middleware (`skipHydration: true`). When validation fails (either invalid code response or network error), the system SHALL explicitly set `isValid` to `false` to maintain consistent authentication state.

#### Scenario: Valid invitation code submitted
- **WHEN** user enters a valid invitation code and submits the form
- **THEN** the system SHALL call `validateCode()` from `src/lib/api/validate-code.ts`
- **AND** on a successful validation response, store the code in the session store via persist middleware
- **AND** navigate to `/instructions` via `navigate('/instructions', { history: 'replace' })`

#### Scenario: Invalid invitation code submitted
- **WHEN** user enters an invalid invitation code and submits the form
- **THEN** the system SHALL display an error message indicating the code is invalid
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

## ADDED Requirements
### Requirement: Hydration-Safe Session Access
The Access Control screen SHALL use the `useHydratedSessionStore()` hook (or equivalent) to access the Zustand session store, ensuring that the component waits for localStorage hydration to complete before rendering with hydrated state values. During hydration, the component SHALL render with default state values (`code: ''`, `isValid: null`) rather than stale or inconsistent values.

#### Scenario: User navigates to Access Control page with existing localStorage session
- **WHEN** a user with a previously validated session (stored in localStorage) navigates to `/`
- **THEN** the component SHALL wait for hydration to complete
- **AND** after hydration, either redirect to `/instructions` (if `isValid === true`) or display the form with default state (if `isValid === false` or `null`)

#### Scenario: User navigates to Access Control page without localStorage session
- **WHEN** a user without any stored session navigates to `/`
- **THEN** the component SHALL render immediately with default state (`code: ''`, `isValid: null`)
- **AND** the "Verify Code" button SHALL be disabled until the user enters text in the input field