import { useState, useEffect } from 'react'
import { Form, Button, Tabs, Card, message, Layout } from 'antd'
import type { LoginParams } from '@/api/services/user'
import type { TabsProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { handleUserLogin } from '@/api/services/user'
import { getToken, setToken } from '@/utils/storage.ts'

import AccountLogin from './account-login'
import EmailLogin from './email-login'

const { Content } = Layout

const Login = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  const [form] = Form.useForm()

  // 统一处理登录逻辑
  const handleLogin = async (values: LoginParams) => {
    try {
      setLoading(true)

      // 邮箱登录和密码登录参数相同,子传父
      const params: LoginParams = values

      // 获取token
      const { data } = await handleUserLogin(params)

      // 存储Token
      setToken('access_token', data.access_token)
      setToken('refresh_token', data.refresh_token)

      // 获取用户信息
      // const { data: userInfo } = await authApi.getUserInfo();

      // message.success(`欢迎回来，${userInfo.name}`);

      // 登录成功后跳转到首页或上次访问的页面
      // const redirectPath = location.state?.from || '/dashboard'
      
      const redirectPath = '/dashboard'

      navigate(redirectPath, {
        replace: true,
        state: {
          firstLogin: true
        }
      })
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
      navigate(location.state?.from || '/dashboard', { replace: true })
    }
  }, [navigate, location])

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
            <Button type="link" className="text-gray-600 hover:text-primary hover:underline"onClick={() => navigate('/register')} >
              立即注册
            </Button>
          </div>
        </Card>
      </Content>
    </Layout>
  )
}

export default Login
