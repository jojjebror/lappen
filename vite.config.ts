import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { APP_DESCRIPTION, APP_NAME, LANG, THEME_COLORS } from './shared/constants/index.ts'

const htmlConstants: Record<string, string> = {
  APP_NAME,
  APP_DESCRIPTION,
  LANG,
  THEME_LIGHT: THEME_COLORS.light,
  THEME_DARK: THEME_COLORS.dark,
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-constants',
      transformIndexHtml: { order: 'pre', handler: (html) => html.replace(/%(\w+)%/g, (match, key: string) => htmlConstants[key] ?? match) },
    },
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      pwaAssets: { config: true, injectThemeColor: false },
      manifest: {
        name: APP_NAME,
        short_name: APP_NAME,
        description: APP_DESCRIPTION,
        theme_color: THEME_COLORS.light,
        background_color: THEME_COLORS.light,
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: LANG,
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
  },
})
