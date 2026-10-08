import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { BottomNav } from '../components/BottomNav'
import { HouseholdProvider } from '../household'
import { usePageSlide } from '../motion'

export function AppLayout() {
  const { pathname } = useLocation()
  const page = usePageSlide<HTMLDivElement>(pathname)
  return (
    <HouseholdProvider>
      <div className="app">
        <div ref={page}>
          <Outlet />
        </div>
        <BottomNav />
        <ScrollRestoration />
      </div>
    </HouseholdProvider>
  )
}
