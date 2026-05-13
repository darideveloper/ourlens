# Project Context

## Purpose

Ourlens is a mobile-first PWA that identifies household hazards for elderly safety using AI. Users capture video/images of their home, frames are extracted and analyzed via multimodal AI, and a safety report with hazard names, risk levels, and actionable recommendations is generated.

## Tech Stack

- **Frontend Framework:** Astro (base) + React (interactive islands)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` configuration)
- **API Calls:** Native `fetch` via typed `safeFetch<T>()` wrapper in `src/lib/api/`
- **State Management:** Zustand with `persist` middleware (localStorage-backed) and `devtools`
- **PWA:** `@vite-pwa/astro` with Workbox (cache-first shell, network-first API, `registerType: 'prompt'`)
- **Backend / Orchestration:** n8n (self-hosted on Docker/Hetzner)
- **AI Engine:** OpenRouter (calling Gemini 1.5 Flash)
- **E2E Validation:** Playwright CLI (interactive browser testing per phase)
- **Runtime:** Node.js >=22.12.0
- **Language:** TypeScript

## Project Conventions

### Code Style

- No comments in code unless explicitly requested
- Use conventional commits format (`feat:`, `fix:`, `chore:`, etc.)
- Mobile-first responsive design with Tailwind utility classes
- High-contrast UI for elderly accessibility (WCAG AAA: 7:1 body, 4.5:1 large text)

### Architecture Patterns

- **Thin Client, Heavy Engine:** Frontend handles UI only; AI processing happens server-side via n8n
- **Astro Islands:** Static pages served by Astro; interactive components (camera, forms) are React islands
- **Hydration Strategy:** `client:load` for camera and forms, `client:idle` for processing overlay, static Astro for content pages
- **View Transitions:** `ClientRouter` for SPA-like navigation, `transition:persist` on scanner island
- **Atomic Design for Components:**
  - `atoms/` — Smallest UI primitives (buttons, inputs, labels, icons)
  - `molecules/` — Composed groups of atoms (form fields, cards, hazard items)
  - `organisms/` — Complex UI sections (camera scanner, safety report, access control form)
- **Camera Logic:** React component uses live frame extraction from camera stream — `canvas.drawImage(video)` every 0.75s for 3s, resize to 1024px, JPEG 0.7, Base64 JSON array. NOT MediaRecorder (unreliable on iOS Safari).
- **API Integration:** All calls use typed `safeFetch<T>()` to n8n webhook endpoints; separate files per domain in `src/lib/api/`; dummy data when `PUBLIC_N8N_BASE_URL` is unset
- **State Management:** Zustand stores with `persist` middleware (`skipHydration: true`) for localStorage-backed state (session, scan history); non-persisted stores for temporal UI state (camera, analysis)
- **Branding Centralization:** All design tokens (colors, fonts, spacing, tap targets, animations) defined in `@theme` block in `src/styles/global.css` — change brand by editing this one file
- **Processing overlay is NOT a separate route:** Shown within the Scanner page to preserve camera stream state

### Route Structure

| Route | Page | Hydration |
|---|---|---|
| `/` | Access Control | React `client:load` |
| `/instructions` | Instructional Home | Static Astro |
| `/scanner` | Camera Scanner + Processing overlay | React `client:load` |
| `/report` | Safety Report | React `client:load` |

### File Structure

```
src/
├── components/atoms/      — UI primitives
├── components/molecules/  — Composed atom groups
├── components/organisms/   — Complex screens
├── hooks/                 — useCamera, useFrameExtractor, useAnalysis
├── lib/api/               — client.ts, validate-code.ts, analyze-frames.ts, types.ts
├── stores/                — use-session-store, use-scan-store, use-camera-store, use-analysis-store
├── layouts/Layout.astro   — Base layout with ClientRouter, PWA meta, skip-to-content
├── pages/                 — index, instructions, scanner, report, offline
└── styles/global.css      — Tailwind v4 @theme with all design tokens
```

### Testing Strategy

- Playwright CLI used to validate each phase's important/visible changes interactively
- No automated test suite at current phase (budget/timeline constrained)
- Each phase task includes specific Playwright CLI validation steps

### Git Workflow

- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- Feature branches merged via PRs

## Domain Context

- **Target Users:** Elderly individuals and their caregivers assessing home safety hazards
- **Core Flow:** Access Control (invitation code) → Instructions → Scanner (+ Processing overlay) → Report
- **AI Prompt Strategy:** The system prompt instructs the AI to act as a Safety Consultant, identifying fall/injury risks for elderly persons with limited mobility, ignoring people and pets
- **Report Format:** Each hazard includes: 1) Hazard Name, 2) Risk Level (Low/High), 3) Actionable Recommendation

## Important Constraints

- **Budget:** $250 USD
- **Timeline:** 6 weeks
- **Target Device:** iOS and Android browsers (mobile-first, portrait orientation)
- **No Image Storage:** n8n MUST NOT save binary files to disk; images exist only in RAM during analysis
- **No Database:** Access codes managed via n8n Static Data node
- **PWA Required:** Must be installable as standalone app (`display: standalone`, `orientation: portrait`)
- **iOS Compatibility:** Must include manual "Add to Home Screen" prompt for full camera permissions
- **Branding:** All visual brand tokens must be changeable from a single file (`src/styles/global.css`)

## External Dependencies

- **OpenRouter API** — AI inference endpoint (Gemini 1.5 Flash model)
- **n8n (self-hosted)** — Workflow orchestration on Hetzner VPS via Docker
- **WebRTC** — Browser camera access via `navigator.mediaDevices.getUserMedia`
- **@vite-pwa/astro** — PWA manifest, service worker, and Workbox configuration

## Project Screens

| Screen | Route | Technical Focus | Description |
|---|---|---|---|
| Access Control | `/` | React `client:load` + `safeFetch` | Validates invitation code against n8n webhook |
| Instructions | `/instructions` | Static Astro | High-contrast UI explaining how to scan your home |
| Camera Scanner | `/scanner` | React `client:load` + WebRTC + `transition:persist` | Live camera view, frame extraction, processing overlay |
| Processing | *(overlay within Scanner)* | React `client:idle` + Zustand | "Scanning..." overlay with progress, shown within Scanner page |
| Safety Report | `/report` | React `client:load` + Zustand | Displays hazards with name, risk level, and fix recommendation |