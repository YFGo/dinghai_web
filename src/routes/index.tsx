import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import AuthRoute from '@/components/AuthRoute';
import Dashboard from '@/pages/Dashboard';

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
  }
])

export default router;