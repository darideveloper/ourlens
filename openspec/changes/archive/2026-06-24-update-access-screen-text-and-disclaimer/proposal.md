## Why

The Access Control screen currently markets the app as an "AI-powered home safety scanner", but the product has broader positioning (hazard awareness in any setting) and must clearly disclaim that it is an educational tool, not a professional safety assessment. The tagline needs to drop the "home" qualifier and the consent area needs a visible disclaimer that sets accurate expectations about scope, data handling, and local processing.

## What Changes

- **Replace tagline** in `src/components/organisms/AccessControl.tsx`:
  - From: `AI-powered home safety scanner for peace of mind.`
  - To: `AI-powered safety scanner for peace of mind.`
- **Add a disclaimer paragraph** directly below the consent checkbox in `src/components/molecules/CodeForm.tsx`. The disclaimer reads:
  > "OurLens™ is an educational hazard-awareness tool and is not a substitute for professional advice, safety assessments, or regulatory compliance reviews. Data is processed locally on your device and is not stored by OurLens."
- Visually demote the disclaimer (smaller text, muted color, breathing room from the checkbox) so it does not compete with the consent prompt.
- No data model, routing, or backend changes.

## Capabilities

### New Capabilities
<!-- None — both touched areas are existing capabilities. -->

### Modified Capabilities

- `access-control`: the Access Control screen tagline is changing (visible copy under the "Welcome to Ourlens" heading).
- `consent-flow`: a disclaimer paragraph is added below the consent checkbox to clarify the educational scope of the tool and confirm local-only data processing.

## Impact

- `src/components/organisms/AccessControl.tsx` — single-line copy change.
- `src/components/molecules/CodeForm.tsx` — new paragraph rendered immediately after the `<label>` containing the checkbox; new copy is pure presentation, no new state or props.
- Visual styling: disclaimer uses existing tokens (`text-on-surface-muted` or `text-on-surface-muted/80`, `text-sm`/`text-xs`, `leading-relaxed`, `mt-2`/`mt-3`) so no new design system entries are required.
- Accessibility: disclaimer is plain text, screen readers will read it after the checkbox label; keep it outside the `<label>` element so it is not announced as part of the checkbox's accessible name.
- No changes to SEO meta tags, `astro.config.mjs`, layout files, or OpenSpec test infrastructure.
