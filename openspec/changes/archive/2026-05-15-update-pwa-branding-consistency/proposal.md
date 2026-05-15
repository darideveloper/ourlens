# Change: Update PWA Branding Consistency

## Why

The PWA metadata (manifest icons, theme_color, favicon) is misaligned with the Ourlens brand identity. The icon source SVGs use a blue/purple gradient (oklch hue 250) instead of the brand coral (oklch hue 20). The `theme_color` is `#fffffe` (surface white) rather than the brand color. The `favicon.svg` depicts an unrelated mountain/A-shape design. No `<meta name="description">` tag exists for SEO or PWA install prompts. Icons must be auto-generated from the actual logo using `@vite-pwa/assets-generator` to ensure single-source-of-truth and easy regeneration.

## What Changes

- Install `@vite-pwa/assets-generator` as a dev dependency and create a config file (`vite-pwa-assets-generator.config.ts`) to generate all icon PNGs from `/ourlens-logo.png`
- Change `theme_color` in manifest and `<meta>` tag from `#fffffe` to the brand-500 color (`#dd4d57`, converted from `oklch(0.62 0.18 20)`)
- Change `background_color` to remain `#fffffe` (matches the app's light surface)
- Regenerate `favicon.svg` to match the full logo with solid background and brand-500 fill, with `prefers-color-scheme: dark` white variant
- Regenerate `favicon.ico` from the new favicon.svg
- Add `<meta name="description" content="AI-powered home safety scanner">` to Layout.astro
- Update `apple-mobile-web-app-status-bar-style` to `black-translucent` for immersive brand-colored status bar
- Fix icon source SVG gradient hues from 250 to 20 for consistency

## Impact

- Affected specs: `pwa-infrastructure`, `visual-design-system`
- Affected code: `astro.config.mjs`, `src/layouts/Layout.astro`, `public/favicon.svg`, `public/favicon.ico`, `public/icons/*`, `package.json`
- New dev dependency: `@vite-pwa/assets-generator`
- New file: `vite-pwa-assets-generator.config.ts`
- Note: `theme_color` is hardcoded in 3 places (`astro.config.mjs`, `Layout.astro` `<meta>` tag, and `global.css` `--color-brand-500` token). A future rebrand requires updating all three since PWA manifests and meta tags cannot consume CSS custom properties.