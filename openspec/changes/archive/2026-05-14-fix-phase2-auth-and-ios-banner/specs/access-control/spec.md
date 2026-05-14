## ADDED Requirements

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