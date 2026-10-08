import type { ButtonHTMLAttributes } from 'react'
import { HAPTIC_VIBRATE_MS } from '../../shared/constants'

const hasSwitchHaptics = () => 'switch' in HTMLInputElement.prototype

export function HapticButton({ className, onClick, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const switchHaptics = hasSwitchHaptics()
  return (
    <button
      {...props}
      className={className ? `${className} haptic` : 'haptic'}
      onClick={(event) => {
        if (!switchHaptics) navigator.vibrate?.(HAPTIC_VIBRATE_MS)
        onClick?.(event)
      }}
    >
      {children}
      {switchHaptics && <input type="checkbox" className="haptic-switch" ref={(input) => input?.setAttribute('switch', '')} aria-hidden="true" tabIndex={-1} />}
    </button>
  )
}
