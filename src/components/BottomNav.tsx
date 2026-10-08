import type { CSSProperties } from 'react'
import { ListChecks, Settings, Star } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { NAV_ICON_SIZE, NAV_LABELS, paths } from '../../shared/constants'
import { HapticButton } from './HapticButton'

const TABS = [
  { to: paths.home, Icon: ListChecks, label: NAV_LABELS.lists, match: (path: string) => path === paths.home || path.startsWith(paths.list('')) },
  { to: paths.often, Icon: Star, label: NAV_LABELS.often, match: (path: string) => path === paths.often },
  { to: paths.settings, Icon: Settings, label: NAV_LABELS.settings, match: (path: string) => path === paths.settings },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const active = TABS.findIndex((tab) => tab.match(pathname))
  return (
    <nav className="bottom-nav" aria-label={NAV_LABELS.main} data-active={active >= 0 || undefined} style={{ '--segments': TABS.length, '--segment': Math.max(active, 0) } as CSSProperties}>
      {TABS.map(({ to, Icon, label }, i) => (
        <HapticButton key={to} className="nav-tab" aria-current={i === active ? 'page' : undefined} onClick={() => navigate(to)}>
          <Icon size={NAV_ICON_SIZE} aria-hidden="true" />
          {label}
        </HapticButton>
      ))}
    </nav>
  )
}
