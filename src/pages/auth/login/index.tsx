import { useState, useEffect } from 'react'
import { Form, Button, Tabs, Card, message, Layout } from 'antd'
import type { LoginParams } from '@/api/services/user'
import type { TabsProps } from 'antd'
import { useRouter } from '@/router/hooks/use-router'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserToken } from '@/redux/modules/userSlice'
import { handleUserLogin } from '@/api/services/user'
import { getToken } from '@/utils/storage.ts'


import AccountLogin from './account-login'
import EmailLogin from './email-login'

const { Content } = Layout

const Login = () => {
  const router = useRouter()
  const location = useLocation()

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  // 统一处理登录逻辑
  const handleLogin = async (values: LoginParams) => {
    try {
      setLoading(true)

      // 邮箱登录和密码登录参数相同,子传父
      const params: LoginParams = values

      // 获取token
      const { data } = await handleUserLogin(params)

      // 存储到redux中
      dispatch(setUserToken(data))
      
      message.success('登录成功')

      const redirectPath = '/dashboard'

      router.replace(redirectPath)
    } catch (error) {
      message.error(error instanceof Error ? error.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  // 父组件简化后
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '账号登录',
      children: <AccountLogin form={form} loading={loading} onSubmit={handleLogin} />
    },
    {
      key: '2',
      label: '邮箱登录',
      children: <EmailLogin form={form} loading={loading} onSubmit={handleLogin} />
    }
  ]

  useEffect(() => {
    if (getToken('accessToken')) {
      router.replace(location.state?.from || '/dashboard')
    }
  }, [router, location])

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <Content className="flex items-center justify-center p-4">
        <Card title="定海网络安全平台" className="w-full max-w-md rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
          <Tabs activeKey={activeTab} items={items} onChange={setActiveTab} centered className="[&_.ant-tabs-nav]:mb-8 [&_.ant-tabs-tab]:px-4 [&_.ant-tabs-tab]:py-2" />
          {/* 底部链接 */}
          <div className="mt-6 flex justify-between px-2 text-sm">
            <Button type="link" className="text-gray-600 hover:text-primary hover:underline">
              忘记密码
            </Button>
            <Button type="link" className="text-gray-600 hover:text-primary hover:underline"onClick={() => router.push('/register')} >
              立即注册
            </Button>
          </div>
        </Card>
      </Content>
    </Layout>
  )
}

export default Login
