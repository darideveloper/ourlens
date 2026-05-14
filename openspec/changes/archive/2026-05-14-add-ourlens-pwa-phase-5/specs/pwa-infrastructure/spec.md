## ADDED Requirements

### Requirement: PWA Update Prompt
The system SHALL detect when a new service worker version is available and display a PWA update prompt with a "Update Now" button, using `useRegisterSW` from `virtual:pwa-register/react`, with `registerType: 'prompt'` so the user controls when to update.

#### Scenario: PWA update available
- **WHEN** a new version of the service worker is detected
- **THEN** the system SHALL display a PWA update prompt with "Update Now" button
- **AND** SHALL NOT auto-reload the page (user controls when to update via `registerType: 'prompt'`)
- **AND** the prompt SHALL have `role="alertdialog"` and minimum 44px tap target