## Context

Phases 1–4 built the complete application: foundation, PWA config, access control, instructions, API layer, camera scanner, processing overlay, and safety report. This final phase focuses on production readiness: PWA update management, comprehensive accessibility compliance, smooth page transitions, and cross-browser verification.

## Goals / Non-Goals

### Goals
- Enable user-controlled PWA updates via `registerType: 'prompt'`
- Ensure all components meet WCAG AAA accessibility standards
- Add smooth page transitions via Astro View Transitions
- Verify offline fallback, camera cleanup, and cross-browser behavior

### Non-Goals
- New features or screens (all core features are complete)
- Performance optimization beyond accessibility and PWA requirements
- Automated test suite (Playwright CLI validation only)

## Decisions

### PWA Update Prompt

- **Decision:** Use `useRegisterSW` from `virtual:pwa-register/react` to detect service worker updates and show a user-controlled "Update available" banner with `role="alertdialog"`.
- **Alternatives considered:** Auto-reload on update (`registerType: 'autoUpdate'`), no update prompt
- **Rationale:** `registerType: 'prompt'` (configured in Phase 1) prevents interrupting a mid-scan user. The update banner gives control to the user, which is critical for an app used by elderly individuals.

### E2E Testing with Playwright CLI

- **Decision:** Use Playwright CLI (browser automation tool) to manually validate each phase's important/visible changes. Not automated test suites.
- **Alternatives considered:** Automated Playwright test suites (overkill for MVP timeline), Cypress (heavier setup), manual-only testing (no replay)
- **Rationale:** Playwright CLI allows quick browser-based validation without writing test files. This gives confidence before moving forward without the overhead of maintaining a test suite.

### View Transitions

- **Decision:** Implement Astro View Transitions with `transition:animate` for gentle page transitions and `transition:animate="none"` for users with `prefers-reduced-motion`.
- **Rationale:** Smooth transitions improve perceived performance and user experience. Respecting reduced motion preference is a WCAG requirement.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| iOS Safari WebRTC edge cases | Manual testing on iOS (task 5.8); `visibilitychange` stream recovery already implemented |
| PWA update prompt may confuse elderly users | Large, clear "Update Now" button with simple language |
| Lighthouse PWA audit may flag edge cases | Address audit findings iteratively |

## Open Questions

- None — this is the final phase and all architectural decisions have been made in earlier phases.