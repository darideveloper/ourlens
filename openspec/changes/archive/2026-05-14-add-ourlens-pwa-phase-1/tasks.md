## Phase 1: Foundation & PWA Configuration

- [x] 1.1 Install dependencies: `@astrojs/react`, `react`, `react-dom`, `tailwindcss`, `zustand`, `@vite-pwa/astro`, `@tailwindcss/vite`
- [x] 1.2 Configure `astro.config.mjs` with React integration and `@vite-pwa/astro` plugin (manifest, Workbox caching strategies, `registerType: 'prompt'`) — Tailwind v4 via `@tailwindcss/vite` Vite plugin (Astro 6 compat)
- [x] 1.3 Configure `tsconfig.json` with path aliases (`@/components`, `@/layouts`, `@/lib`, `@/stores`, `@/styles`, `@/hooks`)
- [x] 1.4 Create `src/styles/global.css` — Tailwind v4 `@import "tailwindcss"` + `@theme` block with all design tokens (colors, fonts, spacing, tap targets, border-radius, shadows, animations)
- [x] 1.5 Create atomic component directory structure: `src/components/atoms/`, `src/components/molecules/`, `src/components/organisms/`
- [x] 1.6 Create store directory: `src/stores/`
- [x] 1.7 Create API directory: `src/lib/api/`
- [x] 1.8 Create base `Layout.astro` with `<ClientRouter />`, skip-to-content link, PWA meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`, `theme-color`), and `<link rel="apple-touch-icon">`
- [x] 1.9 Create offline fallback page `src/pages/offline.astro`
- [x] 1.10 Create Astro page routing: `src/pages/index.astro`, `instructions.astro`, `scanner.astro`, `report.astro`
- [x] 1.11 Create app icons (192px, 512px) and `apple-touch-icon` (180px) in `public/icons/`
- [x] 1.12 Playwright test: verify `npm run build` succeeds, PWA manifest loads, app is installable, offline page renders