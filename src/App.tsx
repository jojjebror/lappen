import { Suspense } from 'react'
import type { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { ThemeProvider } from './theme'

export function App({ router }: { router: ReturnType<typeof createBrowserRouter> }) {
  return (
    <ThemeProvider>
      <Suspense>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  )
}
