# Design: Disable Back Button on Instructions Screen

## Approach

The Layout already computes the current `path` (`Astro.url.pathname`) and conditionally shows the nav bar (`showNav`). We extend this logic to determine whether the back button should be interactive.

### Logic Changes in `Layout.astro`

Add a boolean computed value:

```astro
const backDisabled = path === '/instructions';
```

Then conditionally set attributes and classes on the back `<button>`:

| Attribute          | When `backDisabled` is true                    | When `backDisabled` is false |
| ------------------ | ---------------------------------------------- | ----------------------------- |
| `disabled`         | `disabled`                                     | _(absent)_                    |
| `onclick`          | _(absent)_                                     | `"history.back()"`           |
| CSS classes added  | `opacity-30 cursor-default`                   | _(absent)_                    |
| CSS classes removed| `hover:text-on-surface`                        | _(keep)_                      |

**Approach choice (Option A):** We use the HTML `disabled` attribute exclusively rather than combining `aria-disabled`, `tabindex="-1"`, and `pointer-events-none`. The `disabled` attribute natively prevents clicks, removes the button from the tab order, and communicates the disabled state to assistive technology. This avoids redundant attributes and is simpler for the elderly target audience. Visual dimming is handled by `opacity-30` and `cursor-default` since `disabled` alone only grays out the button in some browsers.

### Accessibility

- The HTML `disabled` attribute natively communicates the disabled state to screen readers and removes the element from the tab order.
- `opacity-30` and `cursor-default` provide visual feedback that the button is not interactive.
- `hover:text-on-surface` is removed when disabled so no hover effect suggests interactivity.

### `transition:persist` Constraint

The live spec currently states the nav bar "SHALL use `transition:persist` to avoid re-rendering across Astro view transitions." The nav in `Layout.astro` does not currently use `transition:persist`. When `transition:persist` is eventually implemented on the `<nav>`, the server-side `backDisabled` flag (computed from `Astro.url.pathname`) will not update across client-side view transitions because the persisted DOM element's attributes would remain from the initial render. At that point, the back button disable logic would need to become a client-side concern (e.g., a `<script>` that reads `location.pathname`). This proposal does not implement `transition:persist` — it only preserves the existing spec text and flags this future concern.

### No Other Changes

- The nav bar structure (logo, title) stays identical.
- No changes to routing or state management.
- The `pageTitles` map and `showNav` logic are untouched.