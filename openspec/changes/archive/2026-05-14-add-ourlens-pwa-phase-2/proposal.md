# Change: Phase 2 — Access Control, Instructions & API Layer

## Why

This phase implements the core user flow entry point and shared infrastructure. Users need an invitation code to access the app (Access Control), clear instructions on how to scan their home (Instructional Home), and a typed API layer to communicate with the n8n backend. This phase also adds Zustand state management for session persistence and the AuthGuard component for route protection. PWA infrastructure components (iOS install banner, offline indicator) are included as they share the Layout.astro.

## What Changes

- **API integration layer:** Typed `safeFetch<T>()` wrapper in `src/lib/api/client.ts` with `FetchError` class, retry logic, `AbortSignal.timeout()`, runtime response validation; separate files per domain (`validate-code.ts`, `analyze-frames.ts`, `types.ts`, `index.ts`); dummy data during development
- **Zustand stores:** `use-session-store.ts` with `skipHydration`, `persist` middleware, `devtools`, async `validateCode` action, and `useHydratedSessionStore` hydration guard hook; `use-scan-store.ts` with persist, version, migrate, partialize, and `useHydratedScanStore` hook
- **Atomic components:** `Button.astro` (accessible, high-contrast, tap targets), `Input.astro` (text input with focus ring), `Icon.astro` (SVG icon component), `IosInstallBanner.tsx` (iOS Safari install prompt), `OfflineIndicator.tsx` (online/offline status banner)
- **Molecular components:** `CodeForm.tsx` (invitation code input with validation), `AuthGuard.tsx` (route protection redirecting unauthenticated users to `/`)
- **Organism components:** `AccessControl.tsx` (CodeForm + brand heading), `InstructionalHome.astro` (high-contrast step-by-step instructions)
- **Page wiring:** `index.astro` → AccessControl, `instructions.astro` → AuthGuard + InstructionalHome, `scanner.astro` → AuthGuard placeholder, `report.astro` → AuthGuard placeholder
- **Layout additions:** IosInstallBanner (`client:idle`) and OfflineIndicator (`client:load`) added to Layout.astro

## Impact

- Affected specs: access-control, api-integration, instructional-home, pwa-infrastructure, frontend-accessibility
- Affected code: `src/lib/api/*`, `src/stores/*`, `src/components/atoms/*`, `src/components/molecules/*`, `src/components/organisms/*`, `src/pages/*`
- **Prerequisites:** Phase 1 (foundation, PWA config, design tokens, layout)
- **Depended on by:** Phase 3 (camera scanner uses stores), Phase 4 (processing/report use stores and API)