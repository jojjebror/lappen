import { Link } from 'react-router'
import { LABELS, paths } from '../../shared/constants'
import { AppHeader } from '../components/AppHeader'

export function NotFound() {
  return (
    <>
      <AppHeader />
      <main className="body stack-tight">
        <p className="hint">{LABELS.notFound}</p>
        <Link to={paths.home} className="text-button">
          {LABELS.goHome}
        </Link>
      </main>
    </>
  )
}
