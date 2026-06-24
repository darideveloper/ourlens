## 1. Production UI Component Text

- [x] 1.1 In `src/components/organisms/CameraScanner.tsx` line 74, change button text `"Analyse video"` → `"Analyze video"`
- [x] 1.2 In `src/components/molecules/ProcessingOverlay.tsx` line 6, change status message `'Analysing video…'` → `'Analyzing video…'`
- [x] 1.3 In `src/components/organisms/InstructionalHome.astro` line 91, change paragraph text `"the AI analyses your home."` → `"the AI analyzes your home."`

## 2. Session Store Error Message

- [x] 2.1 In `src/stores/use-session-store.ts` line 36, change error string from `'That invitation code is not recognised or expired. Please check and try again.'` → `'That invitation code is not recognized or expired. Please check and try again.'`

## 3. E2E Test Selectors

- [x] 3.1 In `tests/e2e/analysis-flow.spec.ts` line 48, change `button:has-text("Analyse")` → `button:has-text("Analyze")`
- [x] 3.2 In `tests/e2e/analysis-flow.spec.ts` line 114, change `button:has-text("Analyse")` → `button:has-text("Analyze")`
- [x] 3.3 In `tests/e2e/analysis-flow.spec.ts` line 165, change `button:has-text("Analyse")` → `button:has-text("Analyze")`

## 4. Client-Facing Documentation

- [x] 4.1 In `CLIENT_README.md` line 51, change `tap **Analyse video**` → `tap **Analyze video**`
- [x] 4.2 In `CLIENT_README.md` line 63, change `tapping **Analyse video**` → `tapping **Analyze video**`
- [x] 4.3 In `CLIENT_README.md` line 101, change `Used to analyse images and generate reports` → `Used to analyze images and generate reports`
- [x] 4.4 In `CLIENT_README.md` line 127, change `**PWA caching behaviour**` → `**PWA caching behavior**`
- [x] 4.5 In `CLIENT_README.md` line 142, change `the AI prompt or analysis behaviour.` → `the AI prompt or analysis behavior.`

## 5. Developer Documentation

- [x] 5.1 In `docs/render-mermaid.md` line 58, change `Background colour. Default is \`white\`.` → `Background color. Default is \`white\`.`
- [x] 5.2 In `docs/render-mermaid.md` line 141, change `matching brand fonts or colours.` → `matching brand fonts or colors.`
- [x] 5.3 In `docs/n8n-setup-guide.md` line 121, change `## Step 5: Create Analyse Frames Webhook` → `## Step 5: Create Analyze Frames Webhook`
- [x] 5.4 In `docs/n8n-setup-guide.md` line 125, change `name it \`Analyse Frames\`` → `name it \`Analyze Frames\``
- [x] 5.5 In `docs/n8n-setup-guide.md` line 134, change webhook path `\`analyse-frames\`` → `\`analyze-frames\``
- [x] 5.6 In `docs/n8n-setup-guide.md` line 182, in the AI system prompt, change `"You are a home safety expert. Analyse these photos of a home interior. Identify physical objects that pose a high fall or injury risk for elderly or mobility-impaired individuals. Use British English spelling (e.g. 'colour', 'centre', 'programme').` → `"You are a home safety expert. Analyze these photos of a home interior. Identify physical objects that pose a high fall or injury risk for elderly or mobility-impaired individuals. Use American English spelling.`
- [x] 5.7 In `docs/n8n-setup-guide.md` line 187, change user message `Analyse these home photos for safety hazards using British English conventions:` → `Analyze these home photos for safety hazards using American English conventions:`
- [x] 5.8 In `docs/n8n-setup-guide.md` line 246, change error response `{ "error": "Analyse failed", "message": "{{ $json.error }}" }` → `{ "error": "Analyze failed", "message": "{{ $json.error }}" }`
- [x] 5.9 In `docs/n8n-setup-guide.md` line 292, change section heading `### Test Analyse Frames` → `### Test Analyze Frames`
- [x] 5.10 In `docs/n8n-setup-guide.md` line 296, change curl URL `/webhook/analyse-frames` → `/webhook/analyze-frames` (only in the dev-guide curl example; the live n8n path is a separate follow-up)
- [x] 5.11 In `docs/n8n-setup-guide.md` line 323, change `optimise prompt` → `optimize prompt`
- [x] 5.12 In `docs/diagrams/component-structure.md` line 185, change `# Colour-coded Low/High risk badge` → `# Color-coded Low/High risk badge`

## 6. Delta Spec Files (already created in this change)

- [x] 6.1 Verify `openspec/changes/convert-british-to-american-english/specs/camera-scanner/spec.md` exists with American text
- [x] 6.2 Verify `openspec/changes/convert-british-to-american-english/specs/processing-overlay/spec.md` exists with American text
- [x] 6.3 Verify `openspec/changes/convert-british-to-american-english/specs/access-control/spec.md` exists with American text

## 7. Final Verification

- [x] 7.1 Run `rg -n "analyse|analyses|analysing|recognised|behaviour|colour" --type-add 'web:*.{astro,tsx,ts,js,mjs,jsx,md,css,mermaid}' -t web src/ tests/ docs/ CLIENT_README.md` and confirm only Mermaid `colour` syntax keywords and CSS/HTML reserved keywords (`color-scheme`, `theme-color`) remain
- [x] 7.2 Build the project: `pnpm build` and confirm zero errors
- [x] 7.3 Run E2E tests: `pnpm test:e2e` and confirm `button:has-text("Analyze")` selectors pass
- [x] 7.4 Run the OpenSpec validation: `openspec validate convert-british-to-american-english --strict` and confirm zero errors
- [ ] 7.5 Archive the change: `openspec archive convert-british-to-american-english` to merge the delta specs into the active spec set
