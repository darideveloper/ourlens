## ADDED Requirements

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