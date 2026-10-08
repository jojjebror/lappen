import type { CSSProperties } from 'react'
import { APP_NAME, LABELS, THEMES, THEME_LABELS } from '../../shared/constants'
import { version } from '../../package.json'
import { AppHeader } from '../components/AppHeader'
import { useTheme } from '../theme'

export function SettingsPage() {
  const { theme, choose } = useTheme()
  return (
    <>
      <AppHeader />
      <main className="body stack">
        <section className="stack-tight">
          <h1 className="section-title">{LABELS.appearance}</h1>
          <div className="segmented" style={{ '--segments': THEMES.length, '--segment': THEMES.indexOf(theme) } as CSSProperties}>
            {THEMES.map((t) => (
              <button key={t} aria-pressed={t === theme} onClick={() => choose(t)}>
                {THEME_LABELS[t]}
              </button>
            ))}
          </div>
        </section>
        <section className="stack-tight">
          <h2 className="section-title">{LABELS.about}</h2>
          <p className="hint">
            {APP_NAME} {version}
          </p>
        </section>
      </main>
    </>
  )
}
