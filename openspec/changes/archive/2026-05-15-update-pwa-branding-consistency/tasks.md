## 1. Install and Configure Assets Generator

- [x] 1.1 Install `@vite-pwa/assets-generator` as a devDependency (`npm install -D @vite-pwa/assets-generator`)
- [x] 1.2 Create `vite-pwa-assets-generator.config.ts` specifying: source image `public/ourlens-logo.png`, output directory `public/icons/`, icon sizes (192x192, 512x512, maskable 192x192 and 512x512, apple-touch-icon 180x180), and maskable padding
- [x] 1.3 Add `"generate-pwa-assets": "pwa-assets-generator --config vite-pwa-assets-generator.config.ts"` script to `package.json`

## 2. Generate PWA Icons from Logo

- [x] 2.1 Run `npm run generate-pwa-assets` and verify that all icon PNGs are produced in `public/icons/` (192, 512, maskable variants, apple-touch-icon)
- [x] 2.2 Verify generated icons are visually correct (full logo with solid background, no clipping, proper padding for maskable variants)
- [x] 2.3 Verify generated filenames match the manifest icon paths in `astro.config.mjs`, or update the manifest paths to match

## 3. Update Manifest Configuration

- [x] 3.1 Update `theme_color` in `astro.config.mjs` manifest from `#fffffe` to `#dd4d57` (brand-500, converted from `oklch(0.62 0.18 20)`)
- [x] 3.2 Verify `background_color` remains `#fffffe` in manifest
- [x] 3.4 Verify manifest icon paths match the filenames generated in step 2
- [x] 3.5 Add a code comment in `astro.config.mjs` noting that `theme_color` must stay in sync with `--color-brand-500` in `global.css` and `<meta name="theme-color">` in `Layout.astro`

## 4. Update HTML Meta Tags

- [x] 4.1 Update `<meta name="theme-color">` in `src/layouts/Layout.astro` from `#fffffe` to `#dd4d57`
- [x] 4.2 Update `<meta name="apple-mobile-web-app-status-bar-style">` in `Layout.astro` from `default` to `black-translucent`
- [x] 4.3 Add `<meta name="description" content="AI-powered home safety scanner">` to `Layout.astro`
- [x] 4.4 Add an HTML comment noting that `theme-color` must stay in sync with `astro.config.mjs` manifest and `global.css` `--color-brand-500`

## 5. Update Icon Source SVGs

- [x] 5.1 Fix `public/icons/icon-source.svg` gradient hue from 250 to 20 (matches brand-500/brand-700: `oklch(0.62 0.18 20)` and `oklch(0.46 0.15 20)`)
- [x] 5.2 Fix `public/icons/icon-maskable-source.svg` gradient hue from 250 to 20

## 6. Regenerate Favicon

- [x] 6.1 Create a new `public/favicon.svg` derived from the full Ourlens logo shape (not a monochrome silhouette) with brand-500 fill (`oklch(0.62 0.18 20)` / `#dd4d57`) and a `prefers-color-scheme: dark` white (`#fff`) variant
- [x] 6.2 Ensure favicon reads clearly at 16×16px (solid background, no fine detail that disappears at small sizes)
- [x] 6.3 Generate or update `public/favicon.ico` to match the new favicon design

## 7. Validation

- [x] 7.1 Run `astro build` and confirm zero build errors
- [x] 7.2 Run `astro dev` and verify manifest JSON at `/manifest.webmanifest` contains correct `theme_color` and icon paths
- [x] 7.3 Verify `theme-color` meta tag value is `#dd4d57` (confirmed in built HTML)
- [x] 7.4 Verify `description` meta tag is present with content "AI-powered home safety scanner" (confirmed in built HTML)
- [x] 7.5 Verify `apple-mobile-web-app-status-bar-style` meta tag value is `black-translucent` (confirmed in built HTML)
- [x] 7.6 Visually confirm the favicon matches the brand logo in browser tab