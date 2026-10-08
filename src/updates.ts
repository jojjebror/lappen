import { UPDATE_CHECK_INTERVAL_MS } from '../shared/constants'

export function checkForUpdates(registration: { update: () => Promise<unknown> }, page: Document = document) {
  const check = () => {
    if (page.visibilityState === 'visible') registration.update().catch(() => undefined)
  }
  page.addEventListener('visibilitychange', check)
  const timer = window.setInterval(check, UPDATE_CHECK_INTERVAL_MS)
  return () => {
    page.removeEventListener('visibilitychange', check)
    window.clearInterval(timer)
  }
}
