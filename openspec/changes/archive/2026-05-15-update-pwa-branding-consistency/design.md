## Context

The PWA icons, manifest theme color, and favicon are currently inconsistent with the Ourlens brand identity. The icon source SVGs use a blue/purple gradient (oklch hue 250) while the brand palette is warm coral (oklch hue 20). The favicon is an entirely different design. The manifest `theme_color` is set to surface white (`#fffffe`) instead of the brand primary color, making browser chrome and PWA splash screens look disconnected from the app's identity.

The project already depends on `@vite-pwa/astro` which includes `@vite-pwa/assets-generator` as a transitive dependency, but it is not directly installed or configured. The `ourlens-logo.png` file in `public/` is the canonical logo (with a solid background) and should be the single source for all PWA icons.

## Goals / Non-Goals

**Goals:**
- Make PWA icons match the Ourlens logo and brand colors
- Automate icon generation from a single source image using `@vite-pwa/assets-generator`
- Align `theme_color` with the brand identity for a cohesive install/splash experience
- Unify favicon with the logo identity (full logo, not monochrome silhouette)
- Add SEO meta description for PWA install prompts and search engines

**Non-Goals:**
- Change the brand color palette itself (it's correct in `global.css`)
- Change the app's visual design or layout
- Add new PWA features (push notifications, background sync, etc.)

## Decisions

### 1. Icon generation: `@vite-pwa/assets-generator` with config file

**Decision:** Install `@vite-pwa/assets-generator` as a devDependency and create `vite-pwa-assets-generator.config.ts` specifying output directory (`public/icons/`), required sizes (192, 512, maskable variants, apple-touch-icon), and maskable padding. Use `ourlens-logo.png` as the single source image.

**Alternatives considered:**
- Manual icon creation in Figma/Photoshop — error-prone, no single source of truth, hard to update
- Inline manifest icon config only (no auto-generation) — requires manually creating 6+ PNG sizes, easy to get wrong
- Third-party online generator (RealFaviconGenerator) — external dependency, not reproducible

**Rationale:** `@vite-pwa/assets-generator` is the official companion tool for `@vite-pwa/astro`. It generates all required PNG sizes, the `apple-touch-icon`, and maskable variants from one source image. The config file ensures output filenames match the manifest icon paths. It's reproducible and can be re-run whenever the logo changes.

### 2. theme_color: brand-500 coral instead of surface white

**Decision:** Change `theme_color` from `#fffffe` to the brand-500 color `#dd4d57` (converted from `oklch(0.62 0.18 20)`). This affects browser chrome, PWA splash screens, and the status bar on Android.

**Alternatives considered:**
- Keep `#fffffe` — safe but creates a visual disconnect; the app's primary actions and brand are coral, not white
- Use `brand-600` (darker, `#9a2733`) — better contrast on white status bar text, but less recognizable as the brand

**Rationale:** The brand coral is the most recognizable color for Ourlens. Using it as theme_color creates a cohesive identity from install prompt through splash screen to in-app experience. On Android, the status bar text auto-adjusts to white against the dark coral background.

**Centralization caveat:** The `theme_color` value (`#dd4d57`) must be maintained in three places during a rebrand: `global.css` (`--color-brand-500`), `astro.config.mjs` (manifest), and `Layout.astro` (`<meta name="theme-color">`). PWA manifests and meta tags cannot consume CSS custom properties.

### 3. background_color: keep surface white `#fffffe`

**Decision:** Keep `background_color` as `#fffffe`. This is the color shown briefly during PWA load before the app renders. The app's background is white, so this provides a seamless transition.

### 4. apple-mobile-web-app-status-bar-style: `black-translucent`

**Decision:** Change from `default` to `black-translucent`. With `theme_color` now set to brand coral, `black-translucent` lets the app content extend behind the status bar with a semi-transparent overlay, creating a more immersive feel.

**Alternatives considered:**
- Keep `default` — shows a white status bar which clashes with the brand coral in the nav
- `black` — solid black status bar, but doesn't allow content to extend underneath

**Trade-off:** `black-translucent` requires ensuring content isn't obscured by the status bar. The Layout already includes `viewport-fit=cover` and the nav bar is fixed, so this should work. If padding issues arise during implementation, revert to `default`.

### 5. favicon: full logo with solid background

**Decision:** Create a new `favicon.svg` derived from the full Ourlens logo (not a simplified monochrome silhouette) with brand-500 fill and a `prefers-color-scheme: dark` white variant. The logo has a solid background, which is ideal for PWA/favicons. The favicon should be legible at 16×16px.

**Rationale:** The user confirmed the logo has a solid background and the favicon should be a full-logo representation, not a simplified silhouette. The current favicon (mountain/A-shape) bears no relation to the Ourlens logo. A consistent favicon reinforces brand recognition across browser tabs and bookmarks.

**Resolved questions:**
1. Does `ourlens-logo.png` have a transparent background? **No — it has a solid background, which is preferred for PWA icons.**
2. Should the favicon use the full logo or a simplified monochrome version? **Full logo, as confirmed by the user.**

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| `@vite-pwa/assets-generator` may produce filenames that don't match manifest icon paths | Configure output filenames in `vite-pwa-assets-generator.config.ts` to match existing naming (`icon-192x192.png`, etc.). Verify after generation and update manifest paths if needed. |
| `black-translucent` status bar may obscure nav content on iOS | Verify on iOS Safari during Playwright testing. Revert to `default` if content is obscured. |
| Brand-500 hex value `#dd4d57` must be maintained in 3 places during rebrand | Document in comments at each location. Acceptable trade-off since PWA manifests cannot consume CSS variables. |
| Logo image may need padding/masking adjustments for maskable icons | Maskable icons require safe area padding. The generator handles this via config. |
| `favicon.ico` may not be auto-generated by the assets generator | May need manual conversion from `favicon.svg` or a separate step in the generation script. |