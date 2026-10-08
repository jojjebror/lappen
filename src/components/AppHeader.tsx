import { ArrowLeft, Moon, Share2, Sun } from 'lucide-react'
import { Link } from 'react-router'
import { APP_NAME, ICON_SIZE, LABELS, LOGO_SIZES, THEME_TOGGLE_LABELS, paths } from '../../shared/constants'
import { useTheme } from '../theme'
import { HapticButton } from './HapticButton'
import { LogoMark } from './LogoMark'

export function AppHeader({ back, onShare }: { back?: boolean; onShare?: () => void }) {
  const { theme, choose } = useTheme()
  const ThemeIcon = theme === 'dark' ? Sun : Moon
  return (
    <header className="top">
      <div className="bar">
        {back ? (
          <Link to={paths.home} className="back">
            <ArrowLeft size={ICON_SIZE} aria-hidden="true" />
            {LABELS.back}
          </Link>
        ) : (
          <Link to={paths.home} className="wordmark">
            <LogoMark width={LOGO_SIZES.wordmark} height={LOGO_SIZES.wordmark} />
            {APP_NAME}
          </Link>
        )}
        <div className="bar-actions">
          {onShare && (
            <HapticButton className="icon-button" onClick={onShare} aria-label={LABELS.share}>
              <Share2 size={ICON_SIZE} aria-hidden="true" />
            </HapticButton>
          )}
          <HapticButton className="icon-button" onClick={() => choose(theme === 'dark' ? 'light' : 'dark')} aria-label={THEME_TOGGLE_LABELS[theme]}>
            <ThemeIcon size={ICON_SIZE} aria-hidden="true" />
          </HapticButton>
        </div>
      </div>
    </header>
  )
}
