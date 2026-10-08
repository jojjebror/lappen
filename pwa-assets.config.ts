import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'
import { APP_LOGO, THEME_COLORS } from './shared/constants/index.ts'

const onAppBackground = { resizeOptions: { background: THEME_COLORS.dark } }

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, ...onAppBackground },
    apple: { ...minimal2023Preset.apple, ...onAppBackground },
  },
  images: [`public${APP_LOGO}`],
})
