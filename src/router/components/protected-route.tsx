import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from '@/router/hooks/use-router'
import { ErrorBoundary } from 'react-error-boundary'

import { selectUserToken } from '@/redux/modules/userSlice' // 获取用户 token 的自定义 hook
import PageError from '@/pages/error/PageError' // 错误页面组件

type Props = {
  children: React.ReactNode // 子组件（要保护的页面内容）
}

// ProtectedRoute 组件，用于保护路由访问
export default function ProtectedRoute({ children }: Props) {
  const router = useRouter()

  const { access_token } = useSelector(selectUserToken)
  // console.log(access_token,3284032);

  // 检查登录状态的函数
  const check = useCallback(() => {
    if (!access_token) {
      // 如果没有 token，跳转到登录页
      router.push('/login')
    }
  }, [router, access_token]) // 依赖项：router 和 access_token

  // 组件挂载时执行检查
  useEffect(() => {
    check()
  }, [check])

  // 用 ErrorBoundary 包裹子组件，防止子组件崩溃导致整个应用崩溃
  return <ErrorBoundary FallbackComponent={PageError}>{children}</ErrorBoundary>
}
