import { Suspense, lazy } from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import type { AppRouteObject } from '@/types/router'
import { SafetyOutlined } from '@ant-design/icons'

const ServerWaf = lazy(() => import('@/pages/site/server-waf'))
const WafApp = lazy(() => import('@/pages/site/waf-app'))
const SiteOwner = lazy(() => import('@/pages/site/site-owner'))

const wafSite: AppRouteObject = {
  order: 3,
  path: '/site',
  element: (
    <Suspense fallback={<div>Loading...</div>}>
      <Outlet />
    </Suspense>
  ),
  meta: {
    label: '站点管理',
    icon: <SafetyOutlined />,
    key: '/site',
    disabled: false,
    suffix: ''
  },
  children: [
    // 默认重定向到第一个子路由
    {
      index: true,
      element: <Navigate to="serverWaf" replace />
    },
    // 站点服务器路由
    {
      path: 'serverWaf',
      element: <ServerWaf />,
      meta: {
        label: '服务器WAF',
        key: '/site/serverWaf',
        disabled: false,
        suffix: ''
      }
    },
    // WAF应用路由
    {
      path: 'wafApp',
      element: <WafApp />,
      meta: {
        label: 'WAF应用',
        key: '/site/wafApp',
        disabled: false,
        suffix: ''
      }
    },
    // 网站负责人路由
    {
      path: 'siteOwner',
      element: <SiteOwner />,
      meta: {
        label: '网站负责人',
        key: '/site/siteOwner',
        disabled: false,
        suffix: ''
      }
    }
  ]
}
export default wafSite