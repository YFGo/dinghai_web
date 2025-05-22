import { useState, useCallback } from 'react'
import { Modal, ModalProps, Button, ButtonProps } from 'antd'
import type { ReactNode } from 'react'


interface UseWafModalOptions {
  /** 默认标题 */
  defaultTitle?: ReactNode
  /** 默认宽度 */
  width?: ModalProps['width']
  /** 是否支持遮罩层关闭 */
  maskClosable?: boolean
  /** 是否支持 ESC 关闭 */
  keyboard?: boolean
}

interface ModalParams<T = any> {
  /** 弹窗标题 */
  title?: ReactNode
  /** 弹窗内容 */
  content: ReactNode | ((close: () => void, data: T) => ReactNode)
  /** 自定义底部区域 */
  footer?: ReactNode | ((close: () => void, loading: boolean) => ReactNode)
  /** 提交处理函数 */
  onOk?: (close: () => void, data: T) => Promise<void> | void
  /** 取消回调 */
  onCancel?: (close: () => void) => void
  /** 其他 Modal 属性 */
  modalProps?: Omit<ModalProps, 'open' | 'title' | 'footer' | 'onOk' | 'onCancel'>
  /** 确认按钮属性 */
  okButtonProps?: ButtonProps
  /** 取消按钮属性 */
  cancelButtonProps?: ButtonProps
}

export function useWafModal(options: UseWafModalOptions = {}) {
  // 默认配置
  const { defaultTitle = '提示', width = 600, maskClosable = false, keyboard = false } = options
  const [modalState, setModalState] = useState<{
    visible: boolean
    loading: boolean
    params?: ModalParams<any>
    data?: any
  }>({
    visible: false,
    loading: false
  })

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, visible: false, data: undefined }))
  }, [])

  const showModal = useCallback(<T = any,>(params: ModalParams<T>, data?: T) => {
    setModalState({
      visible: true,
      loading: false,
      params,
      data
    })
  }, [])

  /** 确定回调 */
  const handleOk = useCallback(async () => {
    if (!modalState.params?.onOk) return closeModal()

    try {
      setModalState(prev => ({ ...prev, loading: true }))
      await modalState.params.onOk(closeModal, modalState.data)
    } finally {
      setModalState(prev => ({ ...prev, loading: false }))
    }
  }, [modalState.params, modalState.data, closeModal])

  /** 取消回调 */
  const handleCancel = useCallback(() => {
    modalState.params?.onCancel?.(closeModal)
    closeModal()
  }, [modalState.params, closeModal])

  /** 渲染弹窗 */
  const renderModal = useCallback(() => {
    const { visible, loading, params } = modalState
    if (!params) return null

    const { title = defaultTitle, content, footer, modalProps = {}, okButtonProps, cancelButtonProps } = params

    const renderContent = typeof content === 'function' ? content(closeModal, modalState.data) : content

    const renderFooter =
      footer === undefined ? (
        <>
          <Button {...cancelButtonProps} onClick={handleCancel}>
            取消
          </Button>
          <Button loading={loading} {...okButtonProps} onClick={handleOk}>
            确定
          </Button>
        </>
      ) : typeof footer === 'function' ? (
        footer(closeModal, loading)
      ) : (
        footer
      )

    return (
      <Modal
        {...modalProps}
        centered={true} // 关键属性：同时水平+垂直居中
        width={modalProps.width || width}
        title={title}
        open={visible}
        footer={renderFooter}
        onCancel={handleCancel}
        maskClosable={modalProps.maskClosable ?? maskClosable}
        keyboard={modalProps.keyboard ?? keyboard}>
        {renderContent}
      </Modal>
    )
  }, [modalState, defaultTitle, width, maskClosable, keyboard, handleOk, handleCancel, closeModal])

  return {
    /** 显示弹窗 */
    showModal,
    /** 关闭弹窗 */
    closeModal,
    /** 当前是否加载中 */
    loading: modalState.loading,
    /** 弹窗渲染方法 */
    renderModal,
    /** 当前弹窗可见状态 */
    modalVisible: modalState.visible
  }
}


//  // 普通弹窗示例
//  const showConfirm = () => {
//   showModal({
//     content: <p>确定要删除这条数据吗？</p>,
//     onOk: (close) => {
//       console.log('执行删除操作');
//       close();
//     }
//   });
// };

// // 复杂弹窗示例
// const showComplexModal = () => {
//   showModal({
//     title: '创建用户',
//     content: (close, data) => (
//       <Form
//         onFinish={(values) => {
//           console.log('提交数据:', values);
//           close();
//         }}
//       >
//         {/* 表单内容 */}
//       </Form>
//     ),
//     footer: (close, loading) => [
//       <Button key="custom" onClick={close}>
//         自定义按钮
//       </Button>,
//       <Button 
//         key="submit" 
//         type="primary" 
//         loading={loading}
//         htmlType="submit"
//       >
//         提交
//       </Button>
//     ]
//   });
// };