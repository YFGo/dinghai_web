import { Suspense, lazy } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import type { AppRouteObject } from '@/types/router'

const HomePage = lazy(() => import('@/pages/dashboard'))

const dashboard: AppRouteObject = {
  order: 1,
  path: '/dashboard', // 父路由路径
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
      index: true, // 默认子路由
      element: <Navigate to="workbench" replace /> // 导航到子路由的 workbench
    },
    {
      path: 'workbench',
      element: <HomePage />,
      meta: {
        label: 'sys.menu.dashboard.workbench',
        key: '/dashboard/workbench'
      }
    }
  ]
}

export default dashboard
