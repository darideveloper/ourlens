# pwa-infrastructure Specification

## Purpose
TBD - created by archiving change fix-phase2-auth-and-ios-banner. Update Purpose after archive.
## Requirements
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

### Requirement: PWA Manifest Configuration
The application SHALL configure a Web App Manifest via `@vite-pwa/astro` plugin with `display: standalone`, `orientation: portrait`, app name, icon URLs (192px, 512px, maskable variants), and `start_url` with PWA source tracking. The `theme_color` SHALL be set to the brand-500 color (`#dd4d57`, converted from `oklch(0.62 0.18 20)`) to match the Ourlens brand identity. The `background_color` SHALL be set to `#fffffe` (matching the surface background). All PWA icon PNGs SHALL be generated from the canonical Ourlens logo (`/ourlens-logo.png`) using `@vite-pwa/assets-generator` with a configuration file (`vite-pwa-assets-generator.config.ts`) to ensure a single source of truth and reproducible output.

#### Scenario: User installs the PWA
- **WHEN** user adds the app to their home screen
- **THEN** the app SHALL open in standalone mode (no browser chrome)
- **AND** SHALL be locked to portrait orientation
- **AND** SHALL display the app icon on the home screen
- **AND** SHALL provide maskable icon variants for adaptive icon support
- **AND** the splash screen and status bar SHALL use the brand-500 theme color (coral `#dd4d57`)

#### Scenario: Brand consistency of PWA icons
- **WHEN** PWA icons are displayed (home screen, splash, browser)
- **THEN** all icons SHALL visually match the Ourlens logo (full logo with solid background)
- **AND** icons SHALL be generated from `/ourlens-logo.png` via `@vite-pwa/assets-generator`
- **AND** the generation SHALL be configurable via `vite-pwa-assets-generator.config.ts`
- **AND** the generation script SHALL be reproducible via `pnpm generate-pwa-assets`

#### Scenario: Theme color rebrand synchronization
- **WHEN** the brand-500 color is changed in `src/styles/global.css`
- **THEN** the `theme_color` in `astro.config.mjs` manifest SHALL also be updated to match
- **AND** the `<meta name="theme-color">` in `Layout.astro` SHALL also be updated to match
- **AND** code comments in both files SHALL reference this synchronization requirement

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

### Requirement: iOS PWA Meta Tags
The application SHALL include `<meta name="apple-mobile-web-app-capable" content="yes">`, `apple-mobile-web-app-status-bar-style` set to `black-translucent`, `apple-mobile-web-app-title`, and `apple-touch-icon` link in the document head. The `theme-color` meta tag SHALL use the brand-500 color (`#dd4d57`) matching the PWA manifest. A `<meta name="description">` tag with the app description SHALL be included for SEO and PWA install prompts.

#### Scenario: PWA meta tags present
- **WHEN** the Layout component renders
- **THEN** the HTML head SHALL include `apple-mobile-web-app-capable` meta tag with content `yes`
- **AND** SHALL include `apple-mobile-web-app-status-bar-style` set to `black-translucent` (semi-transparent status bar over brand content)
- **AND** SHALL include an `apple-touch-icon` link (180x180 minimum)
- **AND** SHALL include `theme-color` meta tag with the brand-500 color value `#dd4d57`
- **AND** SHALL include `description` meta tag with content "AI-powered home safety scanner"

### Requirement: PWA Update Prompt
The system SHALL detect when a new service worker version is available and display a PWA update prompt with a "Update Now" button, using `useRegisterSW` from `virtual:pwa-register/react`, with `registerType: 'prompt'` so the user controls when to update. The prompt SHALL use glass-morphism styling (`backdrop-blur-md bg-surface/80`) and animate in from the bottom.

#### Scenario: PWA update available
- **WHEN** a new version of the service worker is detected
- **THEN** the system SHALL display a PWA update prompt with "Update Now" button
- **AND** SHALL NOT auto-reload the page (user controls when to update via `registerType: 'prompt'`)
- **AND** the prompt SHALL have `role="alertdialog"` and minimum 44px tap target
- **AND** the prompt SHALL use glass-morphism styling with `backdrop-blur-md`
- **AND** the prompt SHALL animate in from the bottom with a `slide-up` effect

