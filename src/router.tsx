import type { RouteObject } from 'react-router'
import { paths, routePatterns } from '../shared/constants'
import { AppLayout } from './routes/AppLayout'
import { JoinPage } from './routes/JoinPage'
import { ListPage } from './routes/ListPage'
import { ListsPage } from './routes/ListsPage'
import { NotFound } from './routes/NotFound'
import { OftenPage } from './routes/OftenPage'
import { SettingsPage } from './routes/SettingsPage'

export const routes: RouteObject[] = [
  {
    path: paths.home,
    element: <AppLayout />,
    children: [
      { index: true, element: <ListsPage /> },
      { path: routePatterns.list, element: <ListPage /> },
      { path: routePatterns.often, element: <OftenPage /> },
      { path: routePatterns.settings, element: <SettingsPage /> },
      { path: routePatterns.join, element: <JoinPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
