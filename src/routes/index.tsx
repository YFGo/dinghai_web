import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/Login';

// 后续会添加更多页面和布局
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />
  }
]);

export default router;