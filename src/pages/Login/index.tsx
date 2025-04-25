import { useState, useEffect } from 'react'
import { Form, Input, Button, Tabs, Card, message, Layout } from 'antd'
import { UserOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons'
import type { TabsProps } from 'antd'
import { loginApi, refreshToken, getUserInfo } from '@/api/services/user' // 导入封装好的接口
import './style.scss'
import { getToken, setToken } from '@/utils/storage.ts' // 导入存储Token的工具函数
import { useNavigate } from 'react-router-dom'
import type { LoginParams } from '@/api/services/user' // 导入类型定义

const { Content } = Layout

const Login = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  const [form] = Form.useForm()

  // 统一处理登录逻辑
  const handleLogin = async (values: any) => {
    try {
      setLoading(true)
      // 根据当前激活的Tab确定登录方式
      const isPasswordLogin = activeTab === '1'
      // 判断是否为邮箱登录
      const isEmail = values.username.includes('@')

      const params: LoginParams = {
        // 直接根据登录类型确定认证方式
        login_method: isPasswordLogin
          ? isEmail
            ? 1
            : 2 // 密码登录：1-邮箱 2-手机
          : 3, // 验证码登录

        // 邮箱和手机号根据登录类型智能填充
        email: isPasswordLogin && isEmail ? values.username : '',
        phone: isPasswordLogin ? (isEmail ? '' : values.username) : values.username, // 验证码登录强制使用手机号

        // 固定初始值
        code: !isPasswordLogin ? values.code :'',
        password: values.password
      }

      // 调用接口
      const { data: tokens } = await loginApi(params)

      // 存储Token
      setToken('AccessToken', tokens.accessToken)
      setToken('RefreshToken', tokens.refreshToken)

      // 获取用户信息
      // const { data: userInfo } = await authApi.getUserInfo();

      // message.success(`欢迎回来，${userInfo.name}`);

      // 登录成功后跳转到首页或上次访问的页面
      const redirectPath = location.state?.from || '/dashboard'
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

  // 处理验证码获取
  const handleGetCode = async () => {
    try {
      const phone = form.getFieldValue('phone')
      if (!phone) {
        message.warning('请输入手机号')
        return
      }

      await authApi.sendSmsCode({ phone })
      message.success('验证码已发送')
      // 这里可以添加倒计时逻辑
    } catch (error) {
      message.error('验证码发送失败')
      console.log(error)
    }
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '账号登录',
      children: (
        <Form form={form} onFinish={handleLogin} size="large" initialValues={{ remember: true }}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入邮箱或手机号' }]}>
            <Input prefix={<UserOutlined />} placeholder="邮箱/手机号" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              立即登录
            </Button>
          </Form.Item>
        </Form>
      )
    },
    {
      key: '2',
      label: '手机登录',
      children: (
        <Form form={form} onFinish={handleLogin} size="large">
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' }
            ]}>
            <Input prefix={<MobileOutlined />} placeholder="手机号" />
          </Form.Item>

          <Form.Item
            name="smsCode"
            rules={[
              { required: true, message: '请输入验证码' },
              { pattern: /^\d{6}$/, message: '6位数字验证码' }
            ]}>
            <div style={{ display: 'flex', gap: 16 }}>
              <Input placeholder="短信验证码" />
              <Button onClick={handleGetCode}>获取验证码</Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              立即登录
            </Button>
          </Form.Item>
        </Form>
      )
    }
  ]

  useEffect(() => {
    if (getToken('accessToken')) {
      navigate(location.state?.from || '/dashboard', { replace: true })
    }
  }, [navigate, location])

  return (
    <Layout className="login-container">
      <Content className="login-content">
        <Card
          title="定海网络安全平台"
          className="login-card"
          styles={{
            header: { border: 0 },
            title: {
              fontSize: 24,
              fontWeight: 500,
              textAlign: 'center',
              width: '100%'
            }
          }}>
          <Tabs activeKey={activeTab} items={items} onChange={setActiveTab} centered tabBarStyle={{ width: '100%' }} />

          <div className="additional-links">
            <Button type="link">忘记密码</Button>
            <Button type="link">立即注册</Button>
          </div>
        </Card>
      </Content>
    </Layout>
  )
}

export default Login
