// @ts-check
// theme_color must stay in sync with:
// - --color-brand-500 in src/styles/global.css
// - <meta name="theme-color"> in src/layouts/Layout.astro
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vitePwa from '@vite-pwa/astro';

export default defineConfig({
  integrations: [
    react(),
    vitePwa({
      registerType: 'prompt',
      manifest: {
        name: 'Ourlens',
        short_name: 'Ourlens',
        description: 'AI-powered home safety scanner',
        theme_color: '#dd4d57',
        background_color: '#fffffe',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/?source=pwa',
        icons: [
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/icon-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,woff2,png,svg,jpg,ico}'],
        runtimeCaching: [
          {
            urlPattern: /\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              networkTimeoutSeconds: 10,
              cacheName: 'api-cache',
            },
          },
        ],
        navigateFallback: '/offline/',
      },
    }),
  ],
  server: {
    allowedHosts: process.env.ALLOWED_HOSTS?.split(',').map(s => s.trim()) || ['ourlens.darideveloper.com'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
