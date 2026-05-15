## 1. Fix Endpoint Paths

- [x] 1.1 In `src/lib/api/validate-code.ts` line 12, change `/webhook/validate-code` to `/validate`
- [x] 1.2 In `src/lib/api/analyze-frames.ts` line 71, change `/webhook/analyze-frames` to `/analyze`

## 2. Configure Environment

- [x] 2.1 Add `PUBLIC_N8N_BASE_URL=https://n8n.apps.darideveloper.com/webhook/ourlens` to `.env`
- [x] 2.2 Add `PUBLIC_N8N_BASE_URL=https://<your-n8n-host>/webhook/<path-prefix>` with a descriptive comment to `.env.example`

## 3. Verify n8n Side

- [x] 3.1 Confirm n8n webhook nodes respond with `Access-Control-Allow-Origin` header for the PWA domain — verified via `allowedOrigins` config in both webhook nodes
- [x] 3.2 Confirm n8n is served over HTTPS — verified via `x-forwarded-proto: https` in test output

## 4. n8n Workflow Fixes

- [x] 4.1 In validate workflow: fix SQL injection — replace `WHERE code = '{{ $json.body.code }}'` with `WHERE code = $1` and move value to Query Parameters field
- [x] 4.2 Import `temp.json` into n8n as the analyze workflow
- [x] 4.3 In the analyze workflow's Call OpenRouter node, replace `YOUR_OPENROUTER_API_KEY` with the real key
- [x] 4.4 Set the system prompt on the AI node using the updated prompt (riskLevel: "High" or "Low" only, no "Medium")

## 5. End-to-End Validation

- [x] 5.1 Start dev server (`pnpm dev`) with `PUBLIC_N8N_BASE_URL` set
- [x] 5.2 Enter a real invitation code — confirm `{ valid: true }` response (not dummy 800ms delay)
- [x] 5.3 Proceed to scanner; capture frames; submit — confirm report page shows real AI-generated hazards (not the 4 hardcoded dummy hazards)
- [x] 5.4 Enter an invalid code — confirm `{ valid: false }` error state is shown
- [x] 5.5 Open browser DevTools → Network tab; confirm POST calls go to `/webhook/ourlens/validate` and `/webhook/ourlens/analyze`
- [x] 5.6 Submit frames with an expired code directly to `/ourlens/analyze` — confirm `{ valid: false }` is returned by n8n
