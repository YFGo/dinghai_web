import { useState } from 'react'
import { useRouter } from '@/router/hooks/use-router'
import UserRegister from './user-register'
import { RegisterParams } from '@/api/services/user'
import { registerUser } from '@/api/services/user'
import { Card, Form, message, Layout } from 'antd'

const { Content } = Layout

function Register() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleRegister = async (values: RegisterParams) => {
    try {
      setLoading(true)
      await registerUser(values)
      message.success('注册成功')
      router.push('/login')
    } catch (error) {
      message.error(error instanceof Error ? error.message : '注册失败')
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
        <Content className="flex items-center justify-center p-4">
          <Card title="定海网络安全平台" className="w-full max-w-md rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <UserRegister form={form} loading={loading} onSubmit={handleRegister} />
            {/* 返回登录 */}
            <div className="mt-4 text-center">
              <span className="text-gray-500">已有账号？</span>
              <a onClick={() => router.push('/login')} className="text-blue-500 hover:underline">
                立即登录
              </a>
            </div>
          </Card>
        </Content>
      </Layout>
    </>
  )
}

export default Register
