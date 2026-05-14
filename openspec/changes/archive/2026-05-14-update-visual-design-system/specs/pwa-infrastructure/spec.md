## MODIFIED Requirements

### Requirement: iOS Add-to-Home-Screen Prompt
The application SHALL detect iOS Safari and display a contextual instruction banner explaining how to add the app to the home screen with step-by-step guidance (Share → Add to Home Screen). The banner SHALL include the Ourlens logo icon and SHALL animate in with a `slide-up` effect. The iOS detection function call SHALL use the correct case-sensitive function name `isIOSPwa` matching its definition.

#### Scenario: User accesses app on iOS Safari
- **WHEN** user opens the app on iOS Safari
- **THEN** the system SHALL detect the iOS platform
- **AND** SHALL display an "Add to Home Screen" instruction banner with the Ourlens logo icon and step-by-step guidance
- **AND** the banner SHALL animate in with a `slide-up` effect
- **AND** the banner SHALL be dismissible and persisted (won't show again after dismissal)

#### Scenario: IosInstallBanner component renders
- **WHEN** the `IosInstallBanner` component renders on any page
- **THEN** the component SHALL call `isIOSPwa()` (matching the function definition case) without throwing a `ReferenceError`
- **AND** the banner SHALL conditionally display based on the detection result
- **AND** the banner SHALL include the Ourlens logo as an icon

### Requirement: Offline Status Indicator
The application SHALL display a "You are offline" banner when the browser reports offline status via `navigator.onLine`. The banner SHALL animate in from the top with a `slide-down` effect and include an offline icon. The `OfflineIndicator` component SHALL NOT render the offline banner during server-side rendering or when the browser is online, to avoid an SSR/client hydration mismatch.

#### Scenario: User's browser goes offline
- **WHEN** the browser fires the `offline` event or `navigator.onLine` is `false` on mount
- **THEN** the system SHALL display an offline status banner at the top of the page
- **AND** the banner SHALL use `role="alert"` for accessibility
- **AND** the banner SHALL animate in from the top with a `slide-down` effect

#### Scenario: User's browser is online
- **WHEN** the browser is online (`navigator.onLine` is `true`)
- **THEN** the offline status banner SHALL NOT be displayed

### Requirement: PWA Manifest Configuration
The application SHALL configure a Web App Manifest via `@vite-pwa/astro` plugin with `display: standalone`, `orientation: portrait`, app name, icon URLs (192px, 512px, maskable variants), and `start_url` with PWA source tracking. The `theme_color` SHALL be set to `#fffffe` (matching the surface background) and `background_color` SHALL be set to `#fffffe`.

#### Scenario: User installs the PWA
- **WHEN** user adds the app to their home screen
- **THEN** the app SHALL open in standalone mode (no browser chrome)
- **AND** SHALL be locked to portrait orientation
- **AND** SHALL display the app icon on the home screen
- **AND** SHALL provide maskable icon variants for adaptive icon support
- **AND** the splash screen and status bar SHALL use the `#fffffe` theme color

### Requirement: PWA Update Prompt
The system SHALL detect when a new service worker version is available and display a PWA update prompt with a "Update Now" button, using `useRegisterSW` from `virtual:pwa-register/react`, with `registerType: 'prompt'` so the user controls when to update. The prompt SHALL use glass-morphism styling (`backdrop-blur-md bg-surface/80`) and animate in from the bottom.

#### Scenario: PWA update available
- **WHEN** a new version of the service worker is detected
- **THEN** the system SHALL display a PWA update prompt with "Update Now" button
- **AND** SHALL NOT auto-reload the page (user controls when to update via `registerType: 'prompt'`)
- **AND** the prompt SHALL have `role="alertdialog"` and minimum 44px tap target
- **AND** the prompt SHALL use glass-morphism styling with `backdrop-blur-md`
- **AND** the prompt SHALL animate in from the bottom with a `slide-up` effect