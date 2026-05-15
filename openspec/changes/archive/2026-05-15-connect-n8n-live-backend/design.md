# Design: Connect PWA to Real n8n AI Backend

## Context

The n8n workflow is self-hosted on a Hetzner VPS behind HTTPS at `https://n8n.apps.darideveloper.com`. It exposes two POST webhook endpoints under the `ourlens/` path prefix:

| Endpoint | Full URL |
|---|---|
| `POST /validate` | `https://n8n.apps.darideveloper.com/webhook/ourlens/validate` |
| `POST /analyze` | `https://n8n.apps.darideveloper.com/webhook/ourlens/analyze` |

`PUBLIC_N8N_BASE_URL` is set to `https://n8n.apps.darideveloper.com/webhook/ourlens` so the API files append only `/validate` and `/analyze`. The PWA previously called `/webhook/validate-code` and `/webhook/analyze-frames` — both wrong. Since `PUBLIC_N8N_BASE_URL` was also unset in `.env`, every call fell through to dummy mode and the mismatch went unnoticed.

## Goals / Non-Goals

- **Goals:** Make code validation and hazard analysis work against the real n8n instance with no dummy data; design and document the n8n analyze workflow
- **Non-Goals:** Change the UI, add new screens, alter retry logic, add authentication tokens

## Decisions

### Decision: Fix paths at the call site, not via a mapping layer

The two endpoint strings are literals in two API files. Fixing them directly is the minimal, correct change.

### Decision: Keep dummy mode intact

`USE_DUMMY = !import.meta.env.PUBLIC_N8N_BASE_URL` already provides a clean fallback for offline/test development. The dummy implementation stays untouched — once the env var is set, both functions automatically go live.

### Decision: `.env` not `.env.production`

The Astro project does not use separate env files per environment. `PUBLIC_N8N_BASE_URL` goes in `.env` and is documented in `.env.example`.

### Decision: Re-validate code on the analyze endpoint

The analyze endpoint checks `is_active` in Postgres before calling OpenRouter. This prevents direct API abuse and expired-code scans that would consume OpenRouter credits. Cost: one extra DB query per scan.

### Decision: Images travel as full data URLs

`canvas.toDataURL('image/jpeg', 0.7)` returns `data:image/jpeg;base64,...`. The full data URL is sent in the `images` array and used directly as the `url` in OpenRouter's vision message format — no stripping or re-prefixing.

### Decision: Parameterized queries in both Postgres nodes

Both the validate and analyze workflows use `$1` placeholders with query parameters instead of string interpolation, preventing SQL injection.

### Decision: n8n output parser is a sample JSON, not a JSON Schema

n8n's Structured Output Parser uses a sample JSON as the template. The correct sample for this project:
```json
{
  "hazards": [
    {
      "name": "Loose hallway rug",
      "riskLevel": "High",
      "recommendation": "Secure with non-slip tape or remove entirely."
    }
  ]
}
```

## n8n Analyze Workflow Structure

```
Analyze (Webhook)
  → Check Code (Postgres: SELECT is_active WHERE code = $1)
  → Code Valid? (IF: $json.is_active === true)
      true  → Build AI Request (Code) → Call OpenRouter (HTTP) → Format Response (Code)
      false → Reject (Set: { valid: false })
```

- **Model:** `google/gemini-2.0-flash` via OpenRouter
- **Timeout:** 60 000 ms
- **Build AI Request** accesses images via `$('Analyze').first().json.body` (original webhook data, not IF node output)
- **Format Response** strips markdown fences before JSON.parse; falls back to `{ hazards: [] }` on parse error

## n8n-Side Requirements

| Requirement | Status |
|---|---|
| CORS headers on both webhook nodes | ✅ Verified — `allowedOrigins` set for both PWA domains |
| HTTPS on n8n host | ✅ Verified — `x-forwarded-proto: https` confirmed |
| Validate workflow SQL injection fix | Parameterized query (`$1`) required |
| Analyze workflow created | `temp.json` import ready |

## Data Contract

| Aspect | PWA Code | n8n | Match? |
|---|---|---|---|
| Validate request body | `{ code }` | `$json.body.code` | ✅ |
| Validate response valid | `{ valid: true }` | Edit Fields: `is_active \|\| false` | ✅ |
| Validate response invalid | `{ valid: false }` | Edit Fields: `false` | ✅ |
| Analyze request body | `{ code, images: string[] }` | `$json.body.code`, `$json.body.images` | ✅ |
| Images encoding | full data URL (`data:image/jpeg;base64,...`) | `url: img` in OpenRouter content | ✅ |
| Analyze response hazards | `{ hazards: Hazard[] }` | Format Response output | ✅ |
| `riskLevel` values | `"High"` or `"Low"` only | `enum: ["High", "Low"]` in system prompt | ✅ |
| Analyze invalid code | falls back to generic message | `{ valid: false }` from Reject node | ⚠️ No dedicated UI error path |
| HTTP method | POST | POST | ✅ |
| Content-Type | `application/json` | JSON body | ✅ |

## Risks / Trade-offs

- **CORS misconfiguration on n8n** → browser will block all live requests; mitigation: test with browser DevTools open
- **n8n cold-start latency** → first request after VPS sleep may time out; existing 30s/45s timeouts and retry logic mitigate this
- **Real API costs** → every scan now calls OpenRouter (Gemini 2.0 Flash); mitigated by invite-only access model and code re-validation on analyze
- **Invalid code on analyze** → frontend shows generic "couldn't parse" fallback, not a dedicated expired-code message; acceptable for current scope
