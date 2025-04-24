// src/components/AuthRoute.tsx

import { Navigate, useLocation } from 'react-router-dom';
import storageToken from '@/utils/storage.ts'; // 导入存储Token的工具函数

export default function AuthRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const accessToken = storageToken.get('accessToken');

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// 使用方式：在路由配置中包裹需要保护的页面
// {
//   path: '/dashboard',
//     element: (
//       <AuthRoute>
//         <DashboardPage />
//       </AuthRoute>
//     )
// }