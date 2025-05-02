import { useRef, useState, useEffect } from 'react'
import { message } from 'antd'
import GoCaptcha from 'go-captcha-react'

// 组件 Props 类型
interface CaptchaVerifyProps {
  // 控制显示
  open: boolean
  // 从后端获取的验证码ID
  captchaId: string
  // 主图URL
  masterImage: string
  // 缩略图URL
  thumbImage: string
  // 刷新验证码的方法（由父组件提供）
  onRefresh: () => Promise<void>
  // 提交验证码的方法（由父组件提供）
  onSubmit: (captchaId: string, angle: number) => Promise<void>
  // 关闭回调
  onClose: () => void
  // 验证成功回调
  onSuccess: () => void
}

// 旋转验证码配置类型
interface RotateConfig {
  width?: number
  height?: number
  thumbWidth?: number
  thumbHeight?: number
  verticalPadding?: number
  horizontalPadding?: number
  showTheme?: boolean
  title?: string
  iconSize?: number
  scope?: boolean
}

// 组件方法类型
interface CaptchaMethods {
  reset: () => void
  clear: () => void
  refresh: () => void
  close: () => void
}

function CaptchaVerify({ open, onSuccess, onClose, captchaId, masterImage, thumbImage, onRefresh, onSubmit }: CaptchaVerifyProps) {
  // 旋转验证码引用
  const rotateRef = useRef<CaptchaMethods>(null)

  // 验证码数据状态
  const [rotateData, setRotateData] = useState({
    image: masterImage,
    thumb: thumbImage,
    thumbSize: 195,
    angle: 0
  })

  // 验证码配置
  const [rotateConfig] = useState<RotateConfig>({
    width: 450,
    height: 220,
    scope: true
  })

  // 当图片数据变化时更新
  useEffect(() => {
    setRotateData({
      image: masterImage,
      thumb: thumbImage,
      thumbSize: 195,
      angle: 0
    })
  }, [masterImage, thumbImage])

  // 处理验证成功
  const handleConfirm = async (angle: number, reset: () => void) => {
    try {
      console.log('提交验证角度:', angle)

      // 验证是否通过
      await onSubmit(captchaId, angle)

      message.success('验证成功')

      // 验证成功后重置验证码
      rotateRef.current?.reset()

      // 调用父组件的成功回调
      onSuccess()
    } catch (error: any) {
      // console.error('验证失败:', error)
      message.error(error.msg)
      rotateRef.current?.reset()
    }
  }

  // 处理刷新验证码
  const handleRefresh = async () => {
    try {
      await onRefresh()
    } catch (error) {
      console.error('刷新验证码失败:', error)
    }
  }

  return (
    <div className={`fixed inset-0 z-[999] bg-black/50 ${open ? 'block' : 'hidden'}`} onClick={onClose}>
      <div className="fixed left-1/2 top-1/2 z-[1000] flex h-auto  -translate-x-1/2 -translate-y-1/2 flex-col items-center overflow-auto rounded-lg  shadow-lg" onClick={e => e.stopPropagation()}>
        <GoCaptcha.Rotate
          data={rotateData}
          events={{
            rotate: (angle: number) => {
              // console.log('当前旋转角度:', angle)
            },
            refresh: handleRefresh,
            close: onClose,
            confirm: handleConfirm
          }}
          config={{
            ...rotateConfig
          }}
          ref={rotateRef}
        />
      </div>
    </div>
  )
}

export default CaptchaVerify
