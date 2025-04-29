import { useState, useRef, useEffect } from 'react'
import { MailOutlined } from '@ant-design/icons'
import { Form, Input, Button, FormInstance, message } from 'antd'
import CaptchaVerify from '@/components/captcha-verify'
import { getCaptcha, sendCaptcha, submitCaptcha } from '@/api/services/user'
import type { LoginParams } from '@/api/services/user'

// 类型定义
interface EmailLoginProps {
  form: FormInstance
  loading?: boolean
  onSubmit: (values: LoginParams) => void
}


function EmailLogin({ form, loading, onSubmit }: EmailLoginProps) {

  // 短信验证码倒计时时长（秒）
  const COUNTDOWN_DURATION = 60

  // 短信验证码倒计时
  const [countdown, setCountdown] = useState(0)
  const countdownRef = useRef<number>(undefined)

  // 图形验证码数据
  const [captchaData, setCaptchaData] = useState({
    id: '',
    master: '',
    thumb: '',
    visible: false
  })

  // 1.获取人机验证数据,并显示图形验证码组件
  const handleGetCode = async () => {
    // 先验证邮箱格式
    try {
      await form.validateFields(['email'])
      // 获取图形验证码数据
      handleCapFetch()
    } catch (err) {
      message.error('请先输入正确的邮箱地址')
    }
  }

  // 2.获取图形验证码数据,方便后续传给子组件
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
      await sendCaptcha({ user_email: email, send_action: 'login' })

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

  // 4.验证图形验证码成功后,提交图形验证结果
  const handleCapSubmit = async (captchaId: string, angle: number) => {
        await submitCaptcha(captchaId, angle)
        message.success('验证成功')
  }

  // 4.处理表单提交
  const handleFinish = (values: { email: string; smsCode: string }) => {
    // 确保已通过图形验证
    if (!captchaData.id) {
      message.error('请先完成安全验证')
      return
    }

    // 非空判断
    if (!values.email || !values.smsCode) {
      message.error('请填写完整的信息')
      return
    }

    // 组合提交数据
    const submitData: LoginParams = {
      login_method: 2, // 邮箱登录
      phone: '', // 手机号留空
      password: '', // 密码留空
      email: values.email,
      code: values.smsCode
    }

    // 子传父的方式传递验证码ID
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
      <Form form={form} onFinish={handleFinish} size="large">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            {
              pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/,
              message: '邮箱格式错误'
            }
          ]}>
          <Input prefix={<MailOutlined />} placeholder="邮箱" />
        </Form.Item>

        <Form.Item
          name="smsCode"
          rules={[
            { required: true, message: '请输入验证码' },
            { pattern: /^\d{6}$/, message: '6位数字验证码' }
          ]}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Input placeholder="邮箱验证码" />
            <Button onClick={handleGetCode} disabled={loading || countdown > 0}>
              {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
            </Button>
          </div>
        </Form.Item>

        <Form.Item>
          <Button color="blue" variant="solid" htmlType="submit" loading={loading} block>
            立即登录
          </Button>
        </Form.Item>
      </Form>

      <CaptchaVerify captchaId={captchaData.id} masterImage={captchaData.master} thumbImage={captchaData.thumb} open={captchaData.visible} onSuccess={handleCapSuccess} onClose={() => setCaptchaData(prev => ({ ...prev, visible: false }))} onRefresh={handleCapFetch} onSubmit={handleCapSubmit} />
    </>
  )
}

export default EmailLogin
