## MODIFIED Requirements

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
