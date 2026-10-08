import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'
import { APP_LOGO } from './shared/constants/index.ts'

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: minimal2023Preset,
  images: [`public${APP_LOGO}`],
})
