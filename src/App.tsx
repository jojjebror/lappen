import { Suspense } from 'react'
import type { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

export function App({ router }: { router: ReturnType<typeof createBrowserRouter> }) {
  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  )
}
