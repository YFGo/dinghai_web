// 导入React相关依赖
import { Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom'

// 导入自定义组件
import { CircleLoading } from '@/components/loading' // 加载中动画组件
import ProtectedRoute from '../components/protected-route' // 路由保护组件

// 导入类型定义
import type { AppRouteObject } from '@/types/router' // 路由对象类型定义

/**
 * 使用React.lazy动态导入错误页面组件
 * 实现代码分割，按需加载错误页面
 */
const Page403 = lazy(() => import('@/pages/error/Page403')) // 403无权限页面
const Page404 = lazy(() => import('@/pages/error/Page404')) // 404未找到页面
const Page500 = lazy(() => import('@/pages/error/Page500')) // 500服务器错误页面

/**
 * 错误路由配置对象
 *
 * 该配置实现了：
 * 1. 统一管理各类错误页面路由
 * 2. 使用路由保护机制控制访问权限
 * 3. 支持动态加载和代码分割优化
 */
export const ERROR_ROUTE: AppRouteObject = {
  /**
   * 路由布局元素
   * - ProtectedRoute: 路由保护层，可添加权限验证等逻辑
   * - Suspense: 处理动态加载时的过渡状态
   * - Outlet: 子路由的渲染出口
   */
  element: (
    <ProtectedRoute>
      <Suspense fallback={<CircleLoading />}>
        <Outlet />
      </Suspense>
    </ProtectedRoute>
  ),

  /**
   * 子路由配置
   * 包含三种常见错误页面：
   */
  children: [
    { path: '403', element: <Page403 /> }, // 403禁止访问页面
    { path: '404', element: <Page404 /> }, // 404页面不存在
    { path: '500', element: <Page500 /> } // 500服务器内部错误
  ]
}

// 导出默认配置
export default ERROR_ROUTE
