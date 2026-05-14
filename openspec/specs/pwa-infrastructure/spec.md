# pwa-infrastructure Specification

## Purpose
TBD - created by archiving change fix-phase2-auth-and-ios-banner. Update Purpose after archive.
## Requirements
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

### Requirement: PWA Manifest Configuration
The application SHALL configure a Web App Manifest via `@vite-pwa/astro` plugin with `display: standalone`, `orientation: portrait`, app name, icon URLs (192px, 512px, maskable variants), and `start_url` with PWA source tracking.

#### Scenario: User installs the PWA
- **WHEN** user adds the app to their home screen
- **THEN** the app SHALL open in standalone mode (no browser chrome)
- **AND** SHALL be locked to portrait orientation
- **AND** SHALL display the app icon on the home screen
- **AND** SHALL provide maskable icon variants for adaptive icon support

### Requirement: Service Worker via @vite-pwa/astro
The application SHALL use `@vite-pwa/astro` with Workbox for service worker management, cache-first strategy for app shell assets, and network-first strategy with 10s timeout for API calls.

#### Scenario: App accessed on slow network
- **WHEN** user opens the PWA on a device with weak connectivity
- **THEN** the app SHALL load the cached UI shell instantly via cache-first strategy
- **AND** SHALL attempt network-first for API calls with a 10-second timeout fallback to cache

#### Scenario: User is offline
- **WHEN** user opens the PWA without internet connectivity
- **THEN** the app SHALL serve the cached UI shell from the service worker cache
- **AND** SHALL navigate to an offline fallback page for unknown routes

### Requirement: iOS PWA Meta Tags
The application SHALL include `<meta name="apple-mobile-web-app-capable" content="yes">`, `apple-mobile-web-app-status-bar-style` set to `default`, `apple-mobile-web-app-title`, and `apple-touch-icon` link in the document head.

#### Scenario: PWA meta tags present
- **WHEN** the Layout component renders
- **THEN** the HTML head SHALL include `apple-mobile-web-app-capable` meta tag with content `yes`
- **AND** SHALL include `apple-mobile-web-app-status-bar-style` set to `default` (keeps status bar visible for elderly users)
- **AND** SHALL include an `apple-touch-icon` link (180x180 minimum)
- **AND** SHALL include `theme-color` meta tag

