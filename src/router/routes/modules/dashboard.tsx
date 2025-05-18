import { Suspense, lazy } from 'react'
import { CircleLoading } from '@/components/loading'
import type { AppRouteObject } from '@/types/router'
import { SafetyOutlined } from '@ant-design/icons'

const HomePage = lazy(() => import('@/pages/dashboard'))

const dashboard: AppRouteObject = {
  order: 1,
  path: '/dashboard',
  element: (
    <Suspense fallback={<CircleLoading />}>
      <HomePage />
    </Suspense>
  ),
  meta: {
    label: '工作台',
    icon: <SafetyOutlined />,
    key: '/dashboard'
  }
}

export default dashboard
