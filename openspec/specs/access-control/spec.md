# access-control Specification

## Purpose
TBD - created by archiving change fix-phase2-auth-and-ios-banner. Update Purpose after archive.
## Requirements
### Requirement: Route Protection
The system SHALL prevent unauthenticated access to protected routes (`/instructions`, `/scanner`, `/report`) by checking the session store's `isValid` state after Zustand persist hydration completes. When hydration finishes and no valid session exists in localStorage, `isValid` SHALL resolve to `false` (not `null`), enabling the `AuthGuard` to redirect unauthenticated users to `/`. During hydration (before localStorage is read), a loading spinner SHALL be shown to prevent a flash of protected content.

#### Scenario: Unauthenticated user navigates directly to a protected route
- **WHEN** a user navigates directly to `/instructions`, `/scanner`, or `/report` without a valid invitation code in the session store (`isValid !== true`)
- **THEN** the system SHALL redirect the user to `/` using `navigate('/', { history: 'replace' })`
- **AND** the protected page content SHALL NOT be rendered to the user

#### Scenario: Authenticated user navigates to a protected route
- **WHEN** a user with a valid invitation code (`isValid === true`) navigates to `/instructions`, `/scanner`, or `/report`
- **THEN** the system SHALL render the protected page content normally

#### Scenario: Zustand persist hydration in progress on protected route
- **WHEN** a user navigates to a protected route and the Zustand persist middleware has not yet hydrated localStorage state
- **THEN** the system SHALL show a loading spinner instead of protected content
- **AND** once hydration completes, either redirect to `/` (if `isValid !== true`) or render the protected content (if `isValid === true`)

#### Scenario: Hydration completes with no stored session (first visit or incognito)
- **WHEN** Zustand persist hydration completes and no `ourlens-session` key exists in localStorage
- **THEN** `isValid` SHALL resolve to `false` (not remain `null`)
- **AND** `AuthGuard` SHALL redirect the user to `/`

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

### Requirement: Access Control UI
The Access Control screen SHALL display the Ourlens logo above the branded heading, a single text input for the invitation code with `spellcheck="false"` and placeholder ending with an ellipsis character, and a submit button with gradient background and large tap targets (minimum 44px / `min-h-tap min-w-tap`). The invitation code input SHALL NOT set `inputMode` so the device default full keyboard is presented, allowing any character to be entered. The screen background SHALL use a subtle gradient from `brand-50` to `surface` for visual depth. The form card SHALL animate in with a `scale-in` effect on initial render.

#### Scenario: Access Control screen rendered
- **WHEN** the application loads the Access Control screen at `/`
- **THEN** the Ourlens logo SHALL appear above the heading with explicit `width` and `height` attributes and `alt="Ourlens"`
- **AND** SHALL contain a heading, an invitation code input field, and a gradient submit button
- **AND** all interactive elements SHALL meet minimum 44px tap target size
- **AND** the input field SHALL have a visible focus indicator (`focus-visible:ring-4`) and `spellcheck="false"`
- **AND** the input placeholder SHALL end with an ellipsis character (`…`)
- **AND** the input SHALL NOT restrict the device keyboard to numeric-only (no `inputMode="numeric"`)
- **AND** the form card SHALL animate in with a `scale-in` effect

#### Scenario: Branding update
- **WHEN** a developer changes brand color tokens in `src/styles/global.css`
- **THEN** the Access Control screen gradient, form, and button SHALL reflect the new colors

#### Scenario: Alphanumeric invitation code entered
- **WHEN** a user types an alphanumeric code (e.g., `OURLENS2024`) into the invitation code field
- **THEN** all characters SHALL be accepted and displayed in the input
- **AND** the device SHALL present a full keyboard (not a numeric-only keypad)

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

