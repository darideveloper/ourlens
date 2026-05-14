## Context

Ourlens is a greenfield project — the current codebase is the default Astro "basics" starter template with no application code. The full application must be built from scratch. This phase establishes all foundational infrastructure upon which subsequent phases depend.

## Goals / Non-Goals

### Goals
- Establish the Astro + React + Tailwind v4 + PWA development stack
- Define a centralized branding and design token system via Tailwind v4 `@theme`
- Create the base layout with PWA meta tags and accessibility features
- Set up page routing for all five screens
- Verify the build and PWA configuration with Playwright CLI

### Non-Goals
- Implement any interactive component logic (deferred to Phase 2+)
- Implement authentication or route protection (deferred to Phase 2)
- Implement camera access (deferred to Phase 3)

## Decisions

### Project Structure

```
src/
├── components/
│   ├── atoms/           — UI primitives
│   ├── molecules/       — Composed atom groups
│   └── organisms/       — Complex screens
├── hooks/               — useCamera, useFrameExtractor, useAnalysis
├── lib/
│   └── api/             — client.ts, validate-code.ts, analyze-frames.ts, types.ts
├── stores/              — use-session-store, use-scan-store, use-camera-store, use-analysis-store
├── layouts/
│   └── Layout.astro     — Base layout with ClientRouter, PWA meta, skip-to-content
├── pages/
│   ├── index.astro      — Access Control
│   ├── instructions.astro — Instructional Home
│   ├── scanner.astro    — Camera Scanner + Processing overlay
│   ├── report.astro     — Safety Report
│   └── offline.astro    — Offline fallback
└── styles/
    └── global.css       — Tailwind v4 @theme with all design tokens
```

### Astro + React Islands

- **Decision:** Use Astro as the base framework with React hydrated only for interactive components (camera, forms, dynamic state)
- **Alternatives considered:** Pure React SPA (larger bundle, no static optimization), Next.js (overkill for this scope), Pure Astro components (cannot handle WebRTC/camera state)
- **Rationale:** Astro delivers fast static pages for content screens while React islands handle the camera I/O. `ClientRouter` enables SPA-like View Transitions.

### Hydration Strategy

| Screen | Hydration | Rationale |
|---|---|---|
| Access Control | `client:load` | Form needs immediate interactivity |
| Instructions | Static Astro | No interactivity needed |
| Camera Scanner | `client:load` + `transition:persist` | Zero tolerance for delay; preserve state across navigation |
| Processing Overlay | `client:idle` | Shown within Scanner page, loads when idle |
| Safety Report | `client:load` | Needs Zustand store data immediately |

### Branding via Tailwind v4 `@theme`

- **Decision:** All design tokens (colors, fonts, spacing, tap targets, border-radius, shadows, animations) are centralized in the Tailwind v4 `@theme` block in `src/styles/global.css`. Changing brand identity requires editing only this file.
- **Alternatives considered:** `tailwind.config.mjs` (Tailwind v3 approach), CSS custom properties scattered across components, design tokens JSON
- **Rationale:** Tailwind v4's CSS-first `@theme` is the canonical configuration method. All tokens become utility classes automatically. No config file needed.

```css
/* src/styles/global.css */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Reset default colors — only define what we use */
  --color-*: initial;

  /* Brand colors — change these to rebrand the entire app */
  --color-brand-50: oklch(0.97 0.02 250);
  --color-brand-100: oklch(0.92 0.04 250);
  --color-brand-500: oklch(0.60 0.18 250);
  --color-brand-600: oklch(0.52 0.18 250);
  --color-brand-700: oklch(0.45 0.16 250);

  /* Semantic colors */
  --color-danger-500: oklch(0.55 0.24 25);
  --color-danger-700: oklch(0.45 0.20 25);
  --color-safe-500: oklch(0.55 0.17 145);
  --color-safe-700: oklch(0.45 0.14 145);

  /* Surface colors — light/dark */
  --color-surface: oklch(1 0 0);
  --color-surface-alt: oklch(0.97 0.005 260);
  --color-on-surface: oklch(0.15 0.01 260);
  --color-on-surface-muted: oklch(0.40 0.01 260);

  /* Typography — 17px minimum for elderly users */
  --font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --text-base: 1.0625rem;
  --text-base--line-height: 1.6;
  --text-lg: 1.1875rem;
  --text-lg--line-height: 1.6;
  --text-xl: 1.375rem;
  --text-xl--line-height: 1.5;
  --text-2xl: 1.75rem;
  --text-2xl--line-height: 1.3;
  --text-3xl: 2.125rem;
  --text-3xl--line-height: 1.2;

  /* Tap target — 44px minimum (WCAG 2.5.5 AAA) */
  --spacing-tap: 2.75rem;

  /* Border radius */
  --radius-accessible: 0.5rem;

  /* Focus ring */
  --shadow-focus: 0 0 0 3px oklch(0.60 0.18 250 / 0.4);

  /* Processing animation */
  --animate-pulse-slow: pulse-slow 3s ease-in-out infinite;

  @keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
}
```

### PWA via @vite-pwa/astro

- **Decision:** Use `@vite-pwa/astro` plugin instead of a custom `sw.js`. Configure Workbox caching strategies (cache-first for app shell, network-first for API with 10s timeout), `registerType: 'prompt'` for user-controlled updates, offline fallback page.
- **Alternatives considered:** Custom `sw.js` in `public/`, `workbox-webpack-plugin`, `@astrojs/pwa` (deprecated)
- **Rationale:** `@vite-pwa/astro` handles manifest generation, service worker registration, Workbox configuration, HMR integration, and update prompts. Custom SW requires manual cache routing, version management, and lacks HMR during development.

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vitePwa from '@vite-pwa/astro';

export default defineConfig({
  integrations: [
    react(),
    vitePwa({
      mode: 'production',
      registerType: 'prompt',
      manifest: {
        name: 'Ourlens',
        short_name: 'Ourlens',
        description: 'AI-powered home safety scanner',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/?source=pwa',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/icon-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,woff2,png,svg,jpg,ico}'],
        runtimeCaching: [
          { urlPattern: /\/api\/.*/i, handler: 'NetworkFirst', options: { networkTimeoutSeconds: 10, cacheName: 'api-cache' } },
        ],
        navigateFallback: '/offline/',
      },
    }),
  ],
});
```

### Tailwind v4 CSS-First Config

- **Decision:** Use Tailwind v4's CSS-based configuration (via `@theme` directive in global CSS) instead of a `tailwind.config.mjs` file
- **Rationale:** Astro v6 + `@astrojs/tailwind` uses Tailwind v4, which moves all configuration into CSS. No `tailwind.config.mjs` file is created.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Tailwind v4 CSS-first config is new pattern | Well-documented in Tailwind v4 migration guide; `@theme` block is the canonical approach |
| PWA service worker caching during dev | `@vite-pwa/astro` handles dev mode separately; `registerType: 'prompt'` prevents stale caches |
| Astro v6 compatibility with `@vite-pwa/astro` | Verified in Phase 1 setup; use `@tailwindcss/vite` instead of deprecated `@astrojs/tailwind` |

## Open Questions

- What is the exact n8n webhook URL format? (Will be configured via `PUBLIC_N8N_BASE_URL` environment variable — deferred to Phase 2)
- Exact brand color palette from design input? (Template uses `brand-*` oklch tokens, changeable in `global.css`)