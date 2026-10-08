import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { registerSW } from 'virtual:pwa-register'
import '@fontsource-variable/archivo'
import '@fontsource/saira-condensed/500.css'
import '@fontsource/saira-condensed/600.css'
import '@fontsource/saira-condensed/700.css'
import './styles/index.css'
import { App } from './App'
import { hideSplash } from './motion'
import { routes } from './router'
import { checkForUpdates } from './updates'

registerSW({ immediate: true, onRegisteredSW: (_url, registration) => registration && checkForUpdates(registration) })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App router={createBrowserRouter(routes)} />
  </StrictMode>,
)
hideSplash()
