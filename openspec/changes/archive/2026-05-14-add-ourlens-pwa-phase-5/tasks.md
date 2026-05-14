## Phase 5: PWA Updates, Polish & Accessibility

- [x] 5.1 Create atom: `src/components/atoms/PWAUpdatePrompt.tsx` — React island showing "Update available" banner using `useRegisterSW` from `virtual:pwa-register/react`, `role="alertdialog"`, large tap target for "Update Now"
- [x] 5.2 Audit and enhance all components for WCAG AAA accessibility: ARIA labels, focus management, keyboard navigation, 7:1 contrast ratios for body text, 4.5:1 for large text
- [x] 5.3 Add skip-to-content link in Layout.astro (`sr-only focus:not-sr-only`) — already existed
- [x] 5.4 Ensure touch-optimized tap targets (minimum 44px / `min-h-tap min-w-tap`) and body text at minimum 17px (`text-base`) across all components — already implemented
- [x] 5.5 Implement Astro View Transitions with `transition:animate="slide"` for gentle page transitions, `transition:animate="none"` at root level for `prefers-reduced-motion`
- [x] 5.6 Add offline fallback page rendering via Workbox `navigateFallback` — already existed (`/offline/` page + config)
- [x] 5.7 Verify camera stream cleanup on component unmount and `visibilitychange` (no camera stay-on) — already implemented
- [x] 5.8 Test iOS Safari: camera permissions, "Add to Home Screen" banner visibility, standalone mode, stream recovery after backgrounding
- [x] 5.9 Test Android Chrome: PWA install prompt via `beforeinstallprompt`, camera access, responsive layout
- [x] 5.10 Playwright test: verify Lighthouse PWA audit criteria, accessibility audit (tap targets, contrast, focus order), offline fallback renders correctly
