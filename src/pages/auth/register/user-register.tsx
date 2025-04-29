import { useRef, useState, useEffect } from 'react'
import { Form, Input, Button, message, FormInstance, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import CaptchaVerify from '@/components/captcha-verify'
import { getCaptcha, sendCaptcha, submitCaptcha } from '@/api/services/user'
import type { RegisterParams } from '@/api/services/user'

// 类型定义
interface UserRegisterProps {
  form: FormInstance
  loading: boolean // 加载状态
  onSubmit: (values: RegisterParams) => void
}

function UserRegister({ form, loading, onSubmit }: UserRegisterProps) {
  // 图形验证码数据
  const [captchaData, setCaptchaData] = useState({
    id: '',
    master: '',
    thumb: '',
    visible: false
  })

  // 短信验证码倒计时时长（秒）
  const COUNTDOWN_DURATION = 60

  // 短信验证码倒计时
  const [countdown, setCountdown] = useState(0)
  const countdownRef = useRef<number>(undefined)

  // 1.获取人机验证数据,并显示图形验证码组件
  const handleGetCode = async () => {
    try {
      // 先验证邮箱格式
      await form.validateFields(['email'])

      // 获取图形验证码数据
      handleCapFetch()
    } catch (err) {
      message.error('请先输入正确的邮箱地址')
    }
  }

  const handleCapFetch = async () => {
    try {
      // 调用接口获取图形验证码数据
      const res = await getCaptcha()
      setCaptchaData({
        id: res.data.captcha_id,
        master: res.data.master_image,
        thumb: res.data.thumb_image,
        visible: true
      })
    } catch (err) {
      message.error('获取验证码失败')
    }
  }

  // 2.提交图形验证结果
  const handleCapSubmit = async (captchaId: string, angle: number) => {
    await submitCaptcha(captchaId, angle)
  }

  // 3.处理图形验证成功后获取短信验证码
  const handleCapSuccess = async () => {
    try {
      // 获取邮箱地址
      const email = form.getFieldValue('email')
      if (!email) {
        message.error('请先输入邮箱')
        return
      }

      // 调用发送短信验证码接口
      await sendCaptcha({ user_email: email, send_action: 'sign' })

      message.success('验证码已发送')
      // 启动倒计时
      setCountdown(COUNTDOWN_DURATION)
      countdownRef.current = window.setInterval(() => {
        // 明确使用 window.setInterval,浏览器环境中定时器返回的是 number 类型
        setCountdown(prev => {
          if (prev <= 1) {
            countdownRef.current && clearInterval(countdownRef.current)
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      message.error('发送验证码失败')
    } finally {
      setCaptchaData(prev => ({ ...prev, visible: false }))
    }
  }

  // 表单提交处理函数
  const handleFinish = (values: { email: string; password: string; confirm_password: string; smsCode: string }) => {
    // 字段校验
    if (!values.email || !values.password || !values.confirm_password) {
      message.error('请填写完整的信息')
      return
    }
    // 判断登录方式（邮箱或手机）
    const isEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(values.email)
    const isPhone = /^1[3-9]\d{9}$/.test(values.email)

    if (!isEmail && !isPhone) {
      message.error('请输入有效的邮箱或手机号')
      return
    }

    if (values.password !== values.confirm_password) {
      message.error('两次密码不一致')
      return
    }

    // 构建提交数据
    const submitData = {
      email: values.email,
      code: values.smsCode,
      password: values.password
    }
    // 提交父组件
    onSubmit(submitData)
  }

  // 清理定时器
  useEffect(() => {
    return () => {
      if (countdownRef.current !== undefined) {
        clearInterval(countdownRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* 注册表单 */}
      {/* 表单布局：horizontal 水平布局，vertical 垂直布局，inline 行内布局 */}
      <Form form={form} onFinish={handleFinish} size="large" labelCol={{ span: 5 }} labelAlign="left" style={{ margin: '10px auto' }}>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            {
              pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/,
              message: '邮箱格式错误'
            }
          ]}>
          <Input prefix={<UserOutlined />} placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
        </Form.Item>
        <Form.Item name="confirm_password" label="确认密码" rules={[{ required: true, message: '请确认密码' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="请确认密码" />
        </Form.Item>
        <Form.Item name="smsCode" label="验证码" style={{ marginBottom: 32 }}>
          <Space.Compact className="w-full">
            <Input placeholder="6位验证码" />
            <Button style={{ width: 140 }} onClick={handleGetCode} disabled={loading || countdown > 0}>
              {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
            </Button>
          </Space.Compact>
        </Form.Item>
        {/* 按钮：type 按钮类型，loading 加载状态，block 块级元素 */}
        <Form.Item>
          <Button color="blue" variant="solid" htmlType="submit" loading={false} block>
            注册
          </Button>
        </Form.Item>
      </Form>
      <CaptchaVerify captchaId={captchaData.id} masterImage={captchaData.master} thumbImage={captchaData.thumb} open={captchaData.visible} onSuccess={handleCapSuccess} onClose={() => setCaptchaData(prev => ({ ...prev, visible: false }))} onRefresh={handleCapFetch} onSubmit={handleCapSubmit} />
    </>
  )
}
export default UserRegister
