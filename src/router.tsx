import type { RouteObject } from 'react-router'
import { paths, routePatterns } from '../shared/constants'
import { HomePage } from './routes/HomePage'
import { ListPage } from './routes/ListPage'
import { NotFound } from './routes/NotFound'

export const routes: RouteObject[] = [
  { path: paths.home, element: <HomePage /> },
  { path: routePatterns.list, element: <ListPage /> },
  { path: '*', element: <NotFound /> },
]
