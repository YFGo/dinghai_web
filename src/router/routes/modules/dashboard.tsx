import { Suspense, lazy } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import type { AppRouteObject } from '@/types/router'

const HomePage = lazy(() => import('@/pages/dashboard'))

const dashboard: AppRouteObject = {
  order: 1,
  path: '/dashboard',
  element: (
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: 'sys.menu.dashboard',
    icon: 'HomeOutlined',
    key: '/dashboard'
  },
  children: [
    {
      index: true,
      element: <Navigate to="workbench" replace />
    },
    {
      path: '/dashboard',
      element: <HomePage />,
      meta: {
        label: 'sys.menu.dashboard',
        key: '/dashboard'
      }
    }
  ]
}

export default dashboard