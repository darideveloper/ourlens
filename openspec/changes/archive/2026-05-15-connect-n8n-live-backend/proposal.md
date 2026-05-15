# Change: Connect PWA to Real n8n AI Backend

## Why

The application currently runs in dummy mode for all AI-related operations because `PUBLIC_N8N_BASE_URL` is not set and the hardcoded webhook paths do not match the actual n8n endpoint routes. Additionally, the n8n analyze workflow did not exist and required design, including code re-validation, AI image analysis via OpenRouter, and structured output parsing. This blocks end-to-end usage with real invitation codes and real AI-generated hazard reports.

## What Changes

### Frontend (PWA)
- **Fix endpoint path mismatch** in `src/lib/api/validate-code.ts`: `/webhook/validate-code` → `/validate`
- **Fix endpoint path mismatch** in `src/lib/api/analyze-frames.ts`: `/webhook/analyze-frames` → `/analyze`
- **Set `PUBLIC_N8N_BASE_URL=https://n8n.apps.darideveloper.com/webhook/ourlens`** in `.env`
- **Document `PUBLIC_N8N_BASE_URL`** in `.env.example`

### n8n Validate Workflow
- **Fix SQL injection** in the Postgres node: replace string interpolation with parameterized query (`$1`)

### n8n Analyze Workflow (new)
- **Webhook node** — POST `ourlens/analyze`, CORS for both PWA domains
- **Check Code node** — Postgres parameterized query re-validates `code` against `invitations_codes` table
- **IF node** — branches on `is_active`; invalid/expired code returns `{ valid: false }` immediately
- **Build AI Request node** — formats full data URL images into OpenRouter vision message format; references webhook data via `$('Analyze').first().json.body`
- **Call OpenRouter node** — POST to `https://openrouter.ai/api/v1/chat/completions`, model `google/gemini-2.0-flash`, 60s timeout
- **Format Response node** — strips markdown fences, JSON-parses AI output into `{ hazards: [...] }`
- **Reject node** — returns `{ valid: false }` on invalid code

### Documentation
- **`docs/diagrams/n8n-workflow.md`** — updated to reflect Postgres (not static data), correct endpoint paths, correct model, actual workflow structure

## Impact

- **Affected specs:** `api-integration`
- **Affected code:**
  - `src/lib/api/validate-code.ts` — endpoint path
  - `src/lib/api/analyze-frames.ts` — endpoint path
  - `.env` — `PUBLIC_N8N_BASE_URL`
  - `.env.example` — document `PUBLIC_N8N_BASE_URL`
- **Affected n8n workflows:** validate (SQL fix), analyze (new workflow)
- **Affected docs:** `docs/diagrams/n8n-workflow.md`
- **No UI changes** — the full store, hook, and component chain is already wired correctly

## Data Contract

| Field | Value |
|---|---|
| Validate request | `{ code: string }` |
| Validate response (valid) | `{ valid: true }` |
| Validate response (invalid) | `{ valid: false }` |
| Analyze request | `{ code: string, images: string[] }` where each image is a full data URL (`data:image/jpeg;base64,...`) |
| Analyze response (hazards) | `{ hazards: [{ name: string, riskLevel: "High"\|"Low", recommendation: string }] }` |
| Analyze response (no hazards) | `{ hazards: [] }` |
| Analyze response (invalid code) | `{ valid: false }` |
