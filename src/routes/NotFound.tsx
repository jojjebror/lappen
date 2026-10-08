import { Link } from 'react-router'
import { LABELS, paths } from '../../shared/constants'

export function NotFound() {
  return (
    <main className="page">
      <p className="hint">{LABELS.notFound}</p>
      <Link to={paths.home} className="link">
        {LABELS.goHome}
      </Link>
    </main>
  )
}
