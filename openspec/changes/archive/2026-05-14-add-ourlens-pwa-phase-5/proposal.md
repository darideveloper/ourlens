# Change: Phase 5 — PWA Updates, Polish & Accessibility

## Why

This phase polishes the application for production readiness: PWA update prompts so users can control when updates are applied, comprehensive accessibility audit (WCAG AAA contrast, tap targets, focus management, keyboard navigation), Astro View Transitions for smooth page changes, and offline fallback configuration. This is the final verification phase before the app is ready for real users.

## What Changes

- **PWA update prompt:** `PWAUpdatePrompt.tsx` React island showing "Update available" banner using `useRegisterSW` from `virtual:pwa-register/react`, with `role="alertdialog"` and large tap target for "Update Now"
- **Accessibility audit:** Verify and enhance all components for WCAG AAA compliance, ARIA labels, focus management, keyboard navigation, 7:1 contrast ratios for body text, 4.5:1 for large text
- **View Transitions:** Implement Astro View Transitions with `transition:animate` for gentle page transitions, `transition:animate="none"` at root level for `prefers-reduced-motion`
- **Offline fallback:** Verify Workbox `navigateFallback` config for offline page rendering

## Impact

- Affected specs: pwa-infrastructure, frontend-accessibility
- Affected code: `src/components/atoms/PWAUpdatePrompt.tsx`, `src/layouts/Layout.astro`, all component files (accessibility touch-ups)
- **Prerequisites:** Phase 1 (foundation, PWA config), Phase 2 (iOS banner, offline indicator), Phase 3 (camera scanner), Phase 4 (processing overlay, safety report)
- **Depended on by:** None (final phase)