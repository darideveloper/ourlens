## MODIFIED Requirements

### Requirement: Service Worker via @vite-pwa/astro

The application SHALL use `@vite-pwa/astro` with Workbox for service worker management, cache-first strategy for app shell assets, and network-first strategy with 10s timeout for API calls. The precache manifest SHALL include all HTML pages to enable offline navigation fallback. The service worker SHALL use `registerType: 'autoUpdate'` so that a new service worker activates automatically on the next page navigation after a new deployment, without requiring user interaction.

#### Scenario: App accessed on slow network
- **WHEN** user opens the PWA on a device with weak connectivity
- **THEN** the app SHALL load the cached UI shell instantly via cache-first strategy
- **AND** SHALL attempt network-first for API calls with a 10-second timeout fallback to cache

#### Scenario: User is offline
- **WHEN** user opens the PWA without internet connectivity
- **THEN** the app SHALL serve the cached UI shell from the service worker cache
- **AND** the service worker precache manifest SHALL include all HTML pages (via globPatterns including `.html`)
- **AND** SHALL navigate to an offline fallback page for unknown routes via the precached `/offline/index.html`

#### Scenario: New deployment is available
- **WHEN** a new version of the app has been deployed and the user opens or navigates within the PWA
- **THEN** the service worker SHALL detect the new version and activate it automatically
- **AND** the updated assets SHALL be served on the next page load without user interaction
- **AND** no manual update prompt SHALL be shown
- **AND** the Vite-hashed asset filenames referenced in the served HTML SHALL match the files available on the server (preventing CSS/JS 404s caused by stale HTML referencing old asset hashes)

### Requirement: iOS PWA Meta Tags

The application SHALL include `<meta name="mobile-web-app-capable" content="yes">` (the cross-platform standard tag), `apple-mobile-web-app-status-bar-style` set to `black-translucent`, `apple-mobile-web-app-title`, and `apple-touch-icon` link in the document head. The `theme-color` meta tag SHALL use the brand-500 color (`#dd4d57`) matching the PWA manifest. A `<meta name="description">` tag with the app description SHALL be included for SEO and PWA install prompts. The deprecated `apple-mobile-web-app-capable` tag SHALL NOT be used.

#### Scenario: PWA meta tags present
- **WHEN** the Layout component renders
- **THEN** the HTML head SHALL include `mobile-web-app-capable` meta tag with content `yes` (NOT the deprecated `apple-mobile-web-app-capable`)
- **AND** SHALL include `apple-mobile-web-app-status-bar-style` set to `black-translucent` (semi-transparent status bar over brand content)
- **AND** SHALL include an `apple-touch-icon` link (180x180 minimum)
- **AND** SHALL include `theme-color` meta tag with the brand-500 color value `#dd4d57`
- **AND** SHALL include `description` meta tag with content "AI-powered home safety scanner"

## REMOVED Requirements

### Requirement: PWA Update Prompt

**Reason**: With `registerType: 'autoUpdate'`, the service worker updates silently. There is no update event for the prompt to react to. The `PWAUpdatePrompt` component and its `useRegisterSW` hook usage become dead code and SHALL be removed.

**Migration**: Delete `src/components/organisms/PWAUpdatePrompt.tsx` and remove its import and usage from `src/layouts/Layout.astro`.
