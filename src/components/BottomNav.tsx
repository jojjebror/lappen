import { ListChecks, Settings, Star } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { NAV_ICON_SIZE, NAV_LABELS, paths } from '../../shared/constants'

const TABS = [
  { to: paths.home, Icon: ListChecks, label: NAV_LABELS.lists, match: (path: string) => path === paths.home || path.startsWith(paths.list('')) },
  { to: paths.often, Icon: Star, label: NAV_LABELS.often, match: (path: string) => path === paths.often },
  { to: paths.settings, Icon: Settings, label: NAV_LABELS.settings, match: (path: string) => path === paths.settings },
]

export function BottomNav() {
  const { pathname } = useLocation()
  return (
    <nav className="bottom-nav" aria-label={NAV_LABELS.main}>
      {TABS.map(({ to, Icon, label, match }) => (
        <Link key={to} to={to} className="nav-tab" aria-current={match(pathname) ? 'page' : undefined}>
          <Icon size={NAV_ICON_SIZE} aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
