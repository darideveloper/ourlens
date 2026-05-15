## ADDED Requirements

### Requirement: Build Cache Cleaning

The project SHALL provide an npm script (`dev:clean`) that removes the Vite dependency optimization cache (`node_modules/.vite`) before starting the Astro dev server. This SHALL be used when dependency-related runtime errors occur (e.g., "Cannot read properties of null (reading 'useState')") to recover from a stale or corrupted pre-bundled dependency cache.

#### Scenario: Clean dev start
- **WHEN** the developer runs `npm run dev:clean`
- **THEN** the `node_modules/.vite` directory SHALL be deleted
- **AND** the Astro dev server SHALL start on port 4321
- **AND** Vite SHALL re-optimize all dependencies from scratch

#### Scenario: Recovery from stale cache
- **WHEN** the app shows React hooks errors ("Invalid hook call", "Cannot read properties of null (reading 'useState')") after a dependency change
- **THEN** the developer SHALL run `npm run dev:clean` instead of `npm run dev`
- **AND** the React hooks errors SHALL be resolved after the clean restart
