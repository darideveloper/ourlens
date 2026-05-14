# Proposal: Disable Back Button on Instructions Screen

## Problem

The top navigation bar in `Layout.astro` renders a back button (`history.back()`) on all authenticated pages (`/instructions`, `/scanner`, `/report`). On the `/instructions` (Instructional Home) screen, pressing back is undesirable because:

- The user has just been authenticated and arrived from `/` (Access Control). Going back there would require re-authentication.
- There is no meaningful previous screen within the authenticated flow to return to.
- Tapping back accidentally could disrupt the user's session context.

This creates a confusing UX, especially for the elderly target audience.

## Proposed Solution

Disable the back button when the user is on the `/instructions` page using the HTML `disabled` attribute. This natively prevents clicks, removes the button from the tab order, and communicates the disabled state to assistive technology. Visual dimming is added with `opacity-30` and `cursor-default`, and the hover effect (`hover:text-on-surface`) is removed when disabled. The button remains visible but clearly non-interactive. On `/scanner` and `/report`, the back button continues to function normally via `history.back()`.

## Scope

- **Layout.astro**: Conditionally disable the back button on `/instructions`.
- **Specs affected**: `instructional-home` (new scenario), `visual-design-system` (Top Navigation Bar requirement update).

## Alternatives Considered

1. **Hide the back button entirely on `/instructions`** — This could cause layout shift and remove the visual consistency of the nav bar across screens.
2. **Redirect back to `/instructions`** — Pressing back would just reload the same page, but this is confusing and provides no visual feedback that back is unavailable.

## Risks

- **Low risk**: The change is purely presentational/UX. No data flows or API calls are affected.
- **`transition:persist` future constraint**: The live spec states the nav bar "SHALL use `transition:persist`". When `transition:persist` is eventually implemented on the `<nav>`, the server-side `backDisabled` flag (computed from `Astro.url.pathname`) will not update across client-side view transitions. At that point, the back button disable logic would need to become a client-side concern. This proposal does not implement `transition:persist` — it only preserves the existing spec text and flags this as a future consideration.