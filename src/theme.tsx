import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { DEFAULT_THEME, THEMES, THEME_COLORS, THEME_STORAGE_KEY, type Theme } from '../shared/constants'
import { withViewTransition } from './motion'
import { writeStored } from './storage'

const initialTheme = (): Theme => THEMES.find((t) => t === document.documentElement.dataset.theme) ?? DEFAULT_THEME

const ThemeContext = createContext<{ theme: Theme; choose: (theme: Theme) => void }>({ theme: DEFAULT_THEME, choose: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(initialTheme)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
  }, [theme])

  const choose = (next: Theme) => {
    writeStored(THEME_STORAGE_KEY, next)
    withViewTransition(() => flushSync(() => setTheme(next)))
  }

  return <ThemeContext value={{ theme, choose }}>{children}</ThemeContext>
}

export const useTheme = () => useContext(ThemeContext)
