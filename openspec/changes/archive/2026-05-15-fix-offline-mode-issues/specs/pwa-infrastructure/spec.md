## MODIFIED Requirements

### Requirement: Offline Status Indicator

The application SHALL display a "You are offline" banner when the browser reports offline status via `navigator.onLine`. The banner SHALL animate in from the top with a `slide-down` effect and include an offline icon. The `OfflineIndicator` component SHALL NOT render the offline banner during server-side rendering or when the browser is online, to avoid an SSR/client hydration mismatch.

**Modification Reason:** The current implementation uses `animate-slide-up` which slides from below the viewport. The spec requires `slide-down` from the top. This change aligns implementation with spec. Additionally, add verification that the offline page is properly precached for navigation fallback to work.

#### Scenario: User's browser goes offline
- **WHEN** the browser fires the `offline` event or `navigator.onLine` is `false` on mount
- **THEN** the system SHALL display an offline status banner at the top of the page
- **AND** the banner SHALL use `role="alert"` for accessibility
- **AND** the banner SHALL animate in from the top with a `slide-down` effect (transform: translateY(-100%) → translateY(0))
- **AND** the banner SHALL include an offline icon

#### Scenario: User's browser is online
- **WHEN** the browser is online (`navigator.onLine` is `true`)
- **THEN** the offline status banner SHALL NOT be displayed

#### Scenario: Navigation while offline
- **WHEN** user navigates to any page while offline
- **THEN** the service worker SHALL serve the precached offline fallback page at `/offline/`
- **AND** the offline fallback page SHALL be available in the Workbox precache manifest

### Requirement: Service Worker via @vite-pwa/astro

The application SHALL use `@vite-pwa/astro` with Workbox for service worker management, cache-first strategy for app shell assets, and network-first strategy with 10s timeout for API calls. The precache manifest SHALL include all HTML pages to enable offline navigation fallback.

**Modification Reason:** The current `globPatterns` excludes `.html` files, causing the offline fallback page to not be precached. This breaks the `navigateFallback` functionality. Adding `.html` to globPatterns ensures all pages (including `/offline/`) are available offline.

#### Scenario: App accessed on slow network
- **WHEN** user opens the PWA on a device with weak connectivity
- **THEN** the app SHALL load the cached UI shell instantly via cache-first strategy
- **AND** SHALL attempt network-first for API calls with a 10-second timeout fallback to cache

#### Scenario: User is offline
- **WHEN** user opens the PWA without internet connectivity
- **THEN** the app SHALL serve the cached UI shell from the service worker cache
- **AND** the service worker precache manifest SHALL include all HTML pages (via globPatterns including `.html`)
- **AND** SHALL navigate to an offline fallback page for unknown routes via the precached `/offline/index.html`