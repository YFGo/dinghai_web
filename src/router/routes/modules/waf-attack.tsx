import { Suspense, lazy } from 'react'
import { CircleLoading } from '@/components/loading'

import { Navigate, Outlet } from 'react-router-dom'
import type { AppRouteObject } from '@/types/router'
import { SafetyOutlined } from '@ant-design/icons'

const AttackSafe = lazy(() => import('@/pages/attack'))

const wafAttack: AppRouteObject = {
  order: 6,
  path: '/attack', // 父路由路径
  // 使用Outlet作为子路由的渲染出口，同时添加Suspense加载状态处理,用于配置二级路由
  element: (
    <Suspense fallback={<CircleLoading />}>
      <AttackSafe />
    </Suspense>
  ),
  meta: {
    label: '攻击防护',
    icon: <SafetyOutlined />,
    key: '/attack',
    disabled: false,
    suffix: ''
  }
}
export default wafAttack