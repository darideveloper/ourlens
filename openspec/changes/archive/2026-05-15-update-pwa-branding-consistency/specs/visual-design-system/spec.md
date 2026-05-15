## ADDED Requirements

### Requirement: Brand Consistent Icons
The PWA icons, favicon, and logo SHALL be visually consistent and derived from the same source identity. The favicon (`/favicon.svg`) SHALL use the full Ourlens logo (with solid background) filled with brand-500 color (`#dd4d57`, from `oklch(0.62 0.18 20)`) in light mode and white (`#fff`) in dark mode via `prefers-color-scheme`. The favicon SHALL be legible at 16×16px. The `favicon.ico` SHALL match the favicon.svg design. The PWA icon source SVGs (`icon-source.svg`, `icon-maskable-source.svg`) SHALL use brand-color gradients (oklch hue 20, not hue 250).

#### Scenario: Favicon matches brand identity
- **WHEN** a browser tab displays the favicon
- **THEN** the favicon SHALL visually match the full Ourlens logo (not a simplified monochrome silhouette)
- **AND** the favicon SHALL use brand-500 fill (`#dd4d57`) in light mode and white fill in dark mode
- **AND** the favicon SHALL have a solid background for visibility on any tab bar color

#### Scenario: Favicon.ico consistency
- **WHEN** a browser requests `/favicon.ico`
- **THEN** the favicon.ico SHALL visually match the favicon.svg design

#### Scenario: Icon source SVGs use brand colors
- **WHEN** the icon source SVGs are rendered
- **THEN** `icon-source.svg` and `icon-maskable-source.svg` SHALL use gradient colors derived from brand-500 and brand-700 (oklch hue 20)
- **AND** SHALL NOT use blue/purple gradient colors (oklch hue 250)