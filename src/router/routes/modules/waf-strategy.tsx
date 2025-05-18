import { Suspense, lazy } from 'react'
import { CircleLoading } from '@/components/loading'
import type { AppRouteObject } from '@/types/router'
import { SafetyOutlined } from '@ant-design/icons'

const WafStrategy = lazy(() => import('@/pages/strategy'))

const wafStrategy: AppRouteObject = {
  order: 4,
  path: '/strategy', // 父路由路径
  // 使用Outlet作为子路由的渲染出口，同时添加Suspense加载状态处理,用于配置二级路由
  element: (
    <Suspense fallback={<CircleLoading />}>
      <WafStrategy />
    </Suspense>
  ),
  meta: {
    label: '策略管理',
    icon: <SafetyOutlined />,
    key: '/strategy',
    disabled: false,
    suffix: ''
  }
}

export default wafStrategy
