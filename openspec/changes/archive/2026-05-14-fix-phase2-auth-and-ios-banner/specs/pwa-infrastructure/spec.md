## ADDED Requirements

### Requirement: iOS Add-to-Home-Screen Prompt
The application SHALL detect iOS Safari and display a contextual instruction banner explaining how to add the app to the home screen with step-by-step guidance (Share → Add to Home Screen). The iOS detection function call SHALL use the correct case-sensitive function name `isIOSPwa` matching its definition.

#### Scenario: User accesses app on iOS Safari
- **WHEN** user opens the app on iOS Safari
- **THEN** the system SHALL detect the iOS platform
- **AND** SHALL display an "Add to Home Screen" instruction banner with step-by-step guidance
- **AND** the banner SHALL be dismissible and persisted (won't show again after dismissal)

#### Scenario: IosInstallBanner component renders
- **WHEN** the `IosInstallBanner` component renders on any page
- **THEN** the component SHALL call `isIOSPwa()` (matching the function definition case) without throwing a `ReferenceError`
- **AND** the banner SHALL conditionally display based on the detection result

### Requirement: Offline Status Indicator
The application SHALL display a "You are offline" banner when the browser reports offline status via `navigator.onLine`. The `OfflineIndicator` component SHALL NOT render the offline banner during server-side rendering or when the browser is online, to avoid an SSR/client hydration mismatch.

#### Scenario: User's browser goes offline
- **WHEN** the browser fires the `offline` event or `navigator.onLine` is `false` on mount
- **THEN** the system SHALL display an offline status banner at the top of the page
- **AND** the banner SHALL use `role="alert"` for accessibility

#### Scenario: User's browser is online
- **WHEN** the browser is online (`navigator.onLine` is `true`)
- **THEN** the offline status banner SHALL NOT be displayed

#### Scenario: OfflineIndicator during server-side rendering
- **WHEN** the `OfflineIndicator` component is rendered on the server (Node.js)
- **THEN** the component SHALL initialize its offline state to `false` (hidden)
- **AND** SHALL set the correct state from `navigator.onLine` only after client-side mount via `useEffect`
- **AND** SHALL NOT produce an SSR/client hydration mismatch