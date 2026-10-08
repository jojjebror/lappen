import { useState, type CSSProperties } from 'react'
import { UserPlus } from 'lucide-react'
import { APP_NAME, LABELS, SMALL_ICON_SIZE, THEMES, THEME_LABELS, paths } from '../../shared/constants'
import { version } from '../../package.json'
import { AppHeader } from '../components/AppHeader'
import { HapticButton } from '../components/HapticButton'
import { setName, useUid } from '../data/store'
import { useHousehold } from '../household'
import { shareLink } from '../share'
import { useTheme } from '../theme'

function Household() {
  const uid = useUid()
  const { household } = useHousehold()
  const [name, setDraft] = useState<string>()
  const [copied, setCopied] = useState(false)
  if (!household) return null
  const saved = household.names[uid] ?? ''
  const save = () => {
    if (name !== undefined && name.trim() !== saved) setName(household.id, uid, name.trim())
  }
  const invite = () =>
    shareLink(`${location.origin}${paths.join(household.id)}`, LABELS.inviteTitle, LABELS.inviteText)
      .then(setCopied)
      .catch(() => undefined)

  return (
    <section className="stack-tight reveal">
      <h2 className="section-title">{LABELS.household}</h2>
      <form
        className="add"
        onSubmit={(e) => {
          e.preventDefault()
          save()
          ;(document.activeElement as HTMLElement | null)?.blur()
        }}
      >
        <input value={name ?? saved} onChange={(e) => setDraft(e.target.value)} onBlur={save} placeholder={LABELS.namePlaceholder} aria-label={LABELS.yourName} enterKeyHint="done" autoComplete="given-name" />
      </form>
      <div className="rows">
        {household.members.map((member) => (
          <div key={member} className="row">
            <span className="row-name">{household.names[member] || LABELS.unnamed}</span>
            {member === uid && <span className="badge">{LABELS.you}</span>}
          </div>
        ))}
      </div>
      <p className="hint">{LABELS.inviteHint}</p>
      <HapticButton className="outline-button" onClick={invite}>
        <UserPlus size={SMALL_ICON_SIZE} strokeWidth={2.5} aria-hidden="true" />
        {copied ? LABELS.copied : LABELS.invite}
      </HapticButton>
    </section>
  )
}

export function SettingsPage() {
  const { theme, choose } = useTheme()
  return (
    <>
      <AppHeader />
      <main className="body stack">
        <Household />
        <section className="stack-tight">
          <h2 className="section-title">{LABELS.appearance}</h2>
          <div className="segmented" style={{ '--segments': THEMES.length, '--segment': THEMES.indexOf(theme) } as CSSProperties}>
            {THEMES.map((t) => (
              <HapticButton key={t} aria-pressed={t === theme} onClick={() => choose(t)}>
                {THEME_LABELS[t]}
              </HapticButton>
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
