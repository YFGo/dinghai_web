import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/login';
import AuthRoute from '@/components/AuthRoute';
import Dashboard from '@/pages/dashboard';
import Page403 from '@/pages/error/Page403';

// 后续会添加更多页面和布局
const router = createBrowserRouter([
  {
    path: '*', // 匹配所有未定义的路由
    element: <Navigate to="/login" replace /> // 重定向到登录页
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/dashboard',
    element: (
        <Dashboard />
    )
  },
  {
    path: '/403',
    element: <Page403 />
  }
])

export default router;