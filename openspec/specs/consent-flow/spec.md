### Requirement: User accepts Terms & Conditions before accessing the app

The system SHALL require the user to explicitly accept the Terms & Conditions before granting access to any protected page (instructions, scanner, report). Acceptance MUST be recorded in the client-side session (localStorage).

#### Scenario: User checks T&C and submits valid code

- **WHEN** the user checks the consent checkbox, enters a valid invitation code, and clicks "Verify Code"
- **THEN** the session store persists `termsAccepted: true` and the user is navigated to `/instructions`

#### Scenario: User has already accepted and returns later

- **WHEN** the user returns to the app and the persisted session contains both `isValid: true` and `termsAccepted: true`
- **THEN** the user bypasses the access control screen entirely and lands on `/instructions`

#### Scenario: User is authenticated but has not accepted terms

- **WHEN** a user with a valid code but no `termsAccepted` attempts to navigate to `/instructions`, `/scanner`, or `/report`
- **THEN** the system redirects them back to `/` to complete consent

### Requirement: Checkbox label matches specified text

The checkbox label SHALL display exactly: "By using Ourlens you confirm that you have read and agree to our **terms & conditions**", where "terms & conditions" is bold and links to the external URL.

#### Scenario: Checkbox label renders correctly

- **WHEN** the CodeForm renders on the first screen
- **THEN** the user sees the label text with "terms & conditions" bolded and linked to `https://ourlivesapp.com/our-lens-terms-and-conditions/`

#### Scenario: T&C link opens in new tab

- **WHEN** the user clicks "terms & conditions" in the checkbox label
- **THEN** the link opens `https://ourlivesapp.com/our-lens-terms-and-conditions/` in a new browser tab

### Requirement: Verify Code button is disabled without consent

The system SHALL prevent form submission until both a code is entered AND the T&C checkbox is checked.

#### Scenario: Checkbox unchecked, code entered

- **WHEN** the user has entered a code but the checkbox is unchecked
- **THEN** the "Verify Code" button is disabled (opacity-50, pointer-events-none)

#### Scenario: Checkbox checked, no code

- **WHEN** the user has checked the checkbox but the code input is empty
- **THEN** the "Verify Code" button is disabled

#### Scenario: Both conditions met

- **WHEN** the user has entered a non-empty code AND checked the checkbox
- **THEN** the "Verify Code" button is enabled
