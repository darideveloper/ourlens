## MODIFIED Requirements

### Requirement: Access Control UI
The Access Control screen SHALL display the Ourlens logo above the branded heading, a single text input for the invitation code with `spellcheck="false"` and placeholder ending with an ellipsis character, and a submit button with gradient background and large tap targets (minimum 44px / `min-h-tap min-w-tap`). The screen background SHALL use a subtle gradient from `brand-50` to `surface` for visual depth. The form card SHALL animate in with a `scale-in` effect on initial render.

#### Scenario: Access Control screen rendered
- **WHEN** the application loads the Access Control screen at `/`
- **THEN** the Ourlens logo SHALL appear above the heading with explicit `width` and `height` attributes and `alt="Ourlens"`
- **AND** SHALL contain a heading, an invitation code input field, and a gradient submit button
- **AND** all interactive elements SHALL meet minimum 44px tap target size
- **AND** the input field SHALL have a visible focus indicator (`focus-visible:ring-4`) and `spellcheck="false"`
- **AND** the input placeholder SHALL end with an ellipsis character (`…`)
- **AND** the form card SHALL animate in with a `scale-in` effect

#### Scenario: Branding update
- **WHEN** a developer changes brand color tokens in `src/styles/global.css`
- **THEN** the Access Control screen gradient, form, and button SHALL reflect the new colors