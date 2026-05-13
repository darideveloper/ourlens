# Project Context

## Purpose

Ourlens is a mobile-first PWA that identifies household hazards for elderly safety using AI. Users capture video/images of their home, frames are extracted and analyzed via multimodal AI, and a safety report with hazard names, risk levels, and actionable recommendations is generated.

## Tech Stack

- **Frontend Framework:** Astro (base) + React (interactive islands)
- **Styling:** Tailwind CSS
- **API Calls:** Native `fetch` (no HTTP client libraries)
- **Backend / Orchestration:** n8n (self-hosted on Docker/Hetzner)
- **AI Engine:** OpenRouter (calling Gemini 1.5 Flash)
- **Storage:** `localStorage` (client-side, for session/history)
- **Runtime:** Node.js >=22.12.0
- **Language:** JavaScript/TypeScript

## Project Conventions

### Code Style

- No comments in code unless explicitly requested
- Use conventional commits format (`feat:`, `fix:`, `chore:`, etc.)
- Mobile-first responsive design with Tailwind utility classes
- High-contrast UI for elderly accessibility

### Architecture Patterns

- **Thin Client, Heavy Engine:** Frontend handles UI only; AI processing happens server-side via n8n
- **Astro Islands:** Static pages served by Astro; interactive components (camera, forms) are React islands
- **Atomic Design for Components:**
  - `atoms/` — Smallest UI primitives (buttons, inputs, labels, icons)
  - `molecules/` — Composed groups of atoms (form fields, cards, hazard items)
  - `organisms/` — Complex UI sections (camera scanner, safety report, access control form)
- **Camera Logic:** React component uses a "Snapshot Strategy" — records 3s video, extracts frames every 0.75s via `<canvas>`, resizes to 1024px width, compresses to JPEG 0.7 quality, sends as Base64 JSON array
- **API Integration:** All calls use native `fetch` to n8n webhook endpoints; no external HTTP libraries

### Testing Strategy

- Manual testing on iOS Safari and Android Chrome
- No automated test framework at current phase (budget/timeline constrained)

### Git Workflow

- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- Feature branches merged via PRs

## Domain Context

- **Target Users:** Elderly individuals and their caregivers assessing home safety hazards
- **Core Flow:** Access Control (invitation code) → Instructional Home → Camera Scanner → Processing → Safety Report
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

## External Dependencies

- **OpenRouter API** — AI inference endpoint (Gemini 1.5 Flash model)
- **n8n (self-hosted)** — Workflow orchestration on Hetzner VPS via Docker
- **WebRTC** — Browser camera access via `navigator.mediaDevices.getUserMedia`

## Project Screens

| Screen | Technical Focus | Description |
|---|---|---|
| Access Control | Astro + fetch | Validates invitation code against n8n webhook |
| Instructional Home | Astro Static | High-contrast UI explaining how to scan your home |
| Camera Scanner | React + WebRTC | React island with live view and frame extraction |
| Processing | CSS Animation | "Scanning..." overlay while awaiting n8n response |
| Safety Report | Astro + JSON | Displays hazards with name, risk level, and fix recommendation |