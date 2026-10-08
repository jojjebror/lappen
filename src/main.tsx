import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { registerSW } from 'virtual:pwa-register'
import './styles/index.css'
import { App } from './App'
import { routes } from './router'
import { checkForUpdates } from './updates'

registerSW({ immediate: true, onRegisteredSW: (_url, registration) => registration && checkForUpdates(registration) })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App router={createBrowserRouter(routes)} />
  </StrictMode>,
)
