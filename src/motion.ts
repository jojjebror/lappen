import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MOTION, REDUCED_MOTION_QUERY, SPLASH, paths } from '../shared/constants'

const reduced = () => matchMedia(REDUCED_MOTION_QUERY).matches

const routeDepth = (path: string) =>
  path === paths.settings ? 3 : path === paths.often ? 2 : path.startsWith(paths.list('')) || path.startsWith(paths.join('')) ? 1 : 0

export function usePageSlide<T extends HTMLElement>(pathname: string) {
  const ref = useRef<T>(null)
  const shown = useRef(pathname)
  useLayoutEffect(() => {
    const direction = Math.sign(routeDepth(pathname) - routeDepth(shown.current))
    shown.current = pathname
    if (reduced()) return
    const { durationMs, shiftPx } = MOTION.page
    ref.current?.animate({ opacity: [0, 1], transform: [`translateX(${direction * shiftPx}px)`, 'none'] }, { duration: durationMs, easing: MOTION.easing })
  }, [pathname])
  return ref
}

export function useFlip<T extends HTMLElement>(signature: string) {
  const ref = useRef<T>(null)
  const tops = useRef(new Map<string, number>())
  useLayoutEffect(() => {
    const next = new Map<string, number>()
    for (const el of Array.from(ref.current?.children ?? []) as HTMLElement[]) {
      const key = el.dataset.key
      if (!key) continue
      const before = tops.current.get(key)
      next.set(key, el.offsetTop)
      if (reduced() || tops.current.size === 0) continue
      if (before === undefined) el.animate({ opacity: [0, 1], transform: ['translateY(6px)', 'none'] }, { duration: MOTION.moveMs, easing: MOTION.easing })
      else if (before !== el.offsetTop) el.animate({ transform: [`translateY(${before - el.offsetTop}px)`, 'none'] }, { duration: MOTION.moveMs, easing: MOTION.easing })
    }
    tops.current = next
  }, [signature])
  return ref
}

export function usePresence<T>(value: T | undefined) {
  const [shown, setShown] = useState(value)
  useEffect(() => {
    if (value !== undefined) return setShown(value)
    const timer = setTimeout(() => setShown(undefined), reduced() ? 0 : MOTION.exitMs)
    return () => clearTimeout(timer)
  }, [value])
  return { shown: value ?? shown, leaving: value === undefined && shown !== undefined }
}

export const withViewTransition = (update: () => void) =>
  'startViewTransition' in document && !reduced() ? document.startViewTransition(update) : update()

export function hideSplash(splash = document.getElementById(SPLASH.id)) {
  if (!splash) return
  setTimeout(() => {
    const duration = reduced() ? 0 : SPLASH.fadeMs
    splash.inert = true
    splash.animate({ opacity: [1, 0] }, { duration, easing: MOTION.easing, fill: 'forwards' }).finished.then(() => splash.remove())
  }, SPLASH.showMs - performance.now())
}
