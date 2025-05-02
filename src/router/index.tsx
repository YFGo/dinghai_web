import { createBrowserRouter, Navigate, RouterProvider, type RouteObject } from 'react-router-dom'
import Login from '@/pages/auth/login/index'
import ProtectedRoute from '@/router/components/protected-route'
import Dashboard from '@/pages/dashboard/index'
import { usePermissionRoutes } from '@/router/hooks'
import { ERROR_ROUTE } from '@/router/routes/error-routes'
import ErrorBoundary from 'antd/es/alert/ErrorBoundary'
import type { AppRouteObject } from '@/types/router'

// 公开路由配置(无需认证)
const PUBLIC_ROUTES: AppRouteObject = 
  {
    path: '/login', // 登录页面
    element: (
      <ErrorBoundary>
        <Login />
      </ErrorBoundary>
    )
  }


// 未匹配的路由(404)
const NOT_FOUND_ROUTE = {
  path: '*', // 匹配所有未定义的路由
  element: <Navigate to="/404" replace /> // 重定向到404页面
}

export default function Router() {
  // 获取权限过滤后的动态路由
  const permissionRoutes = usePermissionRoutes()

  // 受保护的主路由(需要认证)
  const PROTECTED_ROUTES = {
    path: '/',
    element: (
      <ProtectedRoute>
        {/* 路由守卫 */}
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> }, // 首页重定向
      ...permissionRoutes, // 合并动态路由
      {
        path: 'dashboard',
        element: <Dashboard />
      }
    ]
  }

  // 路由配置优先级顺序:
  // 1. 公开路由(无需认证) => 2. 受保护的主路由(需要认证) => 3. 错误路由(404) => 4. 未匹配的路由
  const routes = [PUBLIC_ROUTES, PROTECTED_ROUTES, ERROR_ROUTE, NOT_FOUND_ROUTE] as RouteObject[]

  // 创建基于 history 模式的路由
  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}