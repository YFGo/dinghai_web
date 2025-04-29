import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Form, Input, Button, FormInstance, message } from 'antd'
import type { LoginParams } from '@/api/services/user'

interface AccountLoginProps {
  form: FormInstance
  loading?: boolean
  onSubmit: (values: LoginParams) => void
}

function AccountLogin({ form, loading, onSubmit }: AccountLoginProps) {
  // 在组件内部
  const handleFinish = (values: { username: string; password: string }) => {
    // 字段校验
    if (!values.username || !values.password) {
      message.error('请填写完整的信息')
      return
    }

    // 判断登录方式（邮箱或手机）
    const isEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(values.username)
    const isPhone = /^1[3-9]\d{9}$/.test(values.username)

    if (!isEmail && !isPhone) {
      message.error('请输入有效的邮箱或手机号')
      return
    }

    // 构建提交数据
    const submitData: LoginParams = {
      login_method: isEmail ? 1 : 3, // 1-邮箱登录，3-手机登录
      email: isEmail ? values.username : '',
      phone: !isEmail ? values.username : '',
      password: values.password,
      code:''
    }

    // 提交父组件
    onSubmit(submitData)
  }

  return (
    <Form form={form} onFinish={handleFinish} size="large" initialValues={{ remember: true }}>
      <Form.Item name="username" rules={[{ required: true, message: '请输入邮箱或手机号' }]}>
        <Input prefix={<UserOutlined />} placeholder="邮箱/手机号" />
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
      </Form.Item>

      <Form.Item>
        <Button color="blue" variant="solid" htmlType="submit" loading={loading} block>
          立即登录
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AccountLogin
