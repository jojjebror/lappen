import { MOTION, REDUCED_MOTION_QUERY, SPLASH } from '../shared/constants'

export function hideSplash(splash = document.getElementById(SPLASH.id)) {
  if (!splash) return
  setTimeout(() => {
    const duration = matchMedia(REDUCED_MOTION_QUERY).matches ? 0 : SPLASH.fadeMs
    splash.inert = true
    splash.animate({ opacity: [1, 0] }, { duration, easing: MOTION.easing, fill: 'forwards' }).finished.then(() => splash.remove())
  }, SPLASH.showMs - performance.now())
}
