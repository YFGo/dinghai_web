import { Suspense, lazy } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import type { AppRouteObject } from '@/types/router'
import { SafetyOutlined } from '@ant-design/icons'

const WafWhiteList = lazy(() => import('@/pages/white-list'))

const wafWhiteList: AppRouteObject = {
  order: 5,
  path: '/whiteList', // 父路由路径
  // 使用Outlet作为子路由的渲染出口，同时添加Suspense加载状态处理,用于配置二级路由
  element: (
    <Suspense fallback={<div>Loading...</div>}>
      <WafWhiteList />
    </Suspense>
  ),

  meta: {
    label: '白名单管理',
    icon: <SafetyOutlined />,
    key: '/whiteList',
    disabled: false,
    suffix: ''
  }
}
export default wafWhiteList