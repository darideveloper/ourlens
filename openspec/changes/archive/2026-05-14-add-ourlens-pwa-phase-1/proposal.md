# Change: Phase 1 — Foundation & PWA Configuration

## Why

This is the foundational phase of the Ourlens PWA application. It establishes the project scaffold, configures the Astro + React + Tailwind CSS v4 + PWA stack, defines the centralized branding system, creates the base layout with accessibility features, and sets up page routing and offline support. All subsequent phases depend on this infrastructure being in place.

## What Changes

- **Project dependencies:** Install `@astrojs/react`, `react`, `react-dom`, `tailwindcss`, `zustand`, `@vite-pwa/astro`, `@tailwindcss/vite`
- **Astro configuration:** Configure React integration, `@vite-pwa/astro` plugin (manifest, Workbox caching, `registerType: 'prompt'`), Tailwind v4 via `@tailwindcss/vite` Vite plugin
- **TypeScript configuration:** Set up path aliases (`@/components`, `@/layouts`, `@/lib`, `@/stores`, `@/styles`, `@/hooks`)
- **Design tokens:** Create `src/styles/global.css` with Tailwind v4 `@import "tailwindcss"` + `@theme` block containing all tokens (colors, fonts, spacing, tap targets, border-radius, shadows, animations)
- **Atomic design directories:** Create `atoms/`, `molecules/`, `organisms/` under `src/components/`, plus `src/stores/` and `src/lib/api/`
- **Base layout:** Create `Layout.astro` with `<ClientRouter />`, skip-to-content link, PWA meta tags, and global accessibility classes
- **PWA icons:** Create app icons (192px, 512px) and `apple-touch-icon` (180px) in `public/icons/`
- **Page routing:** Create `src/pages/index.astro`, `instructions.astro`, `scanner.astro`, `report.astro`, `offline.astro`

## Impact

- Affected specs: pwa-infrastructure, frontend-accessibility
- Affected code: Entire `src/` directory scaffold, `astro.config.mjs`, `package.json`, `tsconfig.json`, `src/styles/global.css`
- **Prerequisites:** None (this is the first phase)
- **Depended on by:** Phase 2, Phase 3, Phase 4, Phase 5