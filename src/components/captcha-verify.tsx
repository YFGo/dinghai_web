import { useRef, useState, useEffect } from 'react'
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

function CaptchaVerify({ open, onSuccess, onClose, captchaId, masterImage, thumbImage, onRefresh,onSubmit }: CaptchaVerifyProps) {
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
    width: 300,
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
      
      // 验证成功后重置验证码
      rotateRef.current?.reset()

      // 调用父组件的成功回调
      onSuccess()
    } catch (error) {
      console.error('验证失败:', error)
      rotateRef.current?.reset()
    }
  }

  // 处理刷新验证码
  const handleRefresh = async () => {
    try {
      await onRefresh()
      // 刷新成功后重置验证码
      rotateRef.current?.refresh()
    } catch (error) {
      console.error('刷新验证码失败:', error)
    }
  }

  return (
    <div
      style={{
        display: open ? 'block' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明遮罩
        zIndex: 999
      }}
      onClick={onClose} // 点击遮罩层触发关闭
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '90%', // 响应式宽度
          maxWidth: '600px', // 最大宽度限制
          height: 'auto',
          maxHeight: '90vh', // 防止过高
          overflow: 'auto' // 内容过多时滚动
        }}
        onClick={e => e.stopPropagation()} // 阻止点击内容区域冒泡到遮罩
      >
        <GoCaptcha.Rotate
          data={rotateData}
          events={{
            rotate: (angle: number) => {
              console.log('当前旋转角度:', angle)
            },
            refresh: handleRefresh,
            close: onClose,
            confirm: handleConfirm
          }}
          config={rotateConfig}
          ref={rotateRef}
        />
      </div>
    </div>
  )
}

export default CaptchaVerify
