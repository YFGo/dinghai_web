import { useState, useCallback } from 'react'
import { Drawer, Button, ButtonProps } from 'antd'
import { DrawerProps } from 'antd'
import type { ReactNode } from 'react'

interface UseWafDrawerOptions {
  /** 默认标题 */
  defaultTitle?: ReactNode
  /** 默认宽度 */
  width?: number | string
  /** 是否显示右上角的关闭按钮 */
  closable?: boolean
  /** 是否支持 ESC 关闭 */
  keyboard?: boolean
  /** 抽屉方向 */
  placement?: 'top' | 'right' | 'bottom' | 'left'
}

interface DrawerParams<T = any> {
  /** 抽屉标题 */
  title?: ReactNode
  /** 抽屉内容 */
  content: ReactNode | ((close: () => void, data: T) => ReactNode)
  /** 自定义底部区域 */
  footer?: ReactNode | ((close: () => void, loading: boolean) => ReactNode)
  /** 提交处理函数 */
  onOk?: (close: () => void, data: T) => Promise<void> | void
  /** 取消回调 */
  onCancel?: (close: () => void) => void
  /** 其他 Drawer 属性 */
  drawerProps?: Omit<DrawerProps, 'open' | 'title' | 'footer' | 'onClose'>
  /** 确认按钮属性 */
  okButtonProps?: ButtonProps
  /** 取消按钮属性 */
  cancelButtonProps?: ButtonProps
}

export function useWafDrawer(options: UseWafDrawerOptions = {}) {
  // 默认配置
  const { defaultTitle = '提示', width = 600, closable = true, keyboard = true, placement = 'right' } = options

  const [drawerState, setDrawerState] = useState<{
    visible: boolean
    loading: boolean
    params?: DrawerParams<any>
    data?: any
  }>({
    visible: false,
    loading: false
  })

  const closeDrawer = useCallback(() => {
    setDrawerState(prev => ({ ...prev, visible: false, data: undefined }))
  }, [])

  const showDrawer = useCallback(<T = any,>(params: DrawerParams<T>, data?: T) => {
    setDrawerState({
      visible: true,
      loading: false,
      params,
      data
    })
  }, [])

  /** 确定回调 */
  const handleOk = useCallback(async () => {
    if (!drawerState.params?.onOk) return closeDrawer()

    try {
      setDrawerState(prev => ({ ...prev, loading: true }))
      await drawerState.params.onOk(closeDrawer, drawerState.data)
    } finally {
      setDrawerState(prev => ({ ...prev, loading: false }))
    }
  }, [drawerState.params, drawerState.data, closeDrawer])

  /** 取消回调 */
  const handleCancel = useCallback(() => {
    drawerState.params?.onCancel?.(closeDrawer)
    closeDrawer()
  }, [drawerState.params, closeDrawer])

  /** 渲染抽屉 */
  const renderDrawer = useCallback(() => {
    const { visible, loading, params } = drawerState
    if (!params) return null

    const { title = defaultTitle, content, footer, drawerProps = {}, okButtonProps, cancelButtonProps } = params

    const renderContent = typeof content === 'function' ? content(closeDrawer, drawerState.data) : content

    const renderFooter =
      footer === undefined ? (
        <div style={{ textAlign: 'right' }}>
          <Button {...cancelButtonProps} onClick={handleCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button loading={loading} {...okButtonProps} onClick={handleOk} color="primary">
            确定
          </Button>
        </div>
      ) : typeof footer === 'function' ? (
        footer(closeDrawer, loading)
      ) : (
        footer
      )

    return (
      <Drawer {...drawerProps} width={drawerProps.width || width} title={title} open={visible} footer={renderFooter} onClose={handleCancel} closable={drawerProps.closable ?? closable} keyboard={drawerProps.keyboard ?? keyboard} placement={drawerProps.placement ?? placement}>
        {renderContent}
      </Drawer>
    )
  }, [drawerState, defaultTitle, width, closable, keyboard, placement, handleOk, handleCancel, closeDrawer])

  return {
    /** 显示抽屉 */
    showDrawer: showDrawer,
    /** 关闭抽屉 */
    closeDrawer,
    /** 当前是否加载中 */
    loading: drawerState.loading,
    /** 抽屉渲染方法 */
    renderDrawer,
    /** 当前抽屉可见状态 */
    drawerVisible: drawerState.visible
  }
}

// 使用示例:
// const { showDrawer, renderDrawer } = useSafeDrawer();
//
// // 简单抽屉
// const showSimpleDrawer = () => {
//   showDrawer({
//     content: <p>这是抽屉内容</p>,
//     onOk: (close) => {
//       console.log('执行操作');
//       close();
//     }
//   });
// };
//
// // 复杂抽屉
// const showComplexDrawer = () => {
//   showDrawer({
//     title: '复杂抽屉',
//     content: (close, data) => (
//       <Form>
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
//         onClick={() => { /* 提交逻辑 */ }}
//       >
//         提交
//       </Button>
//     ]
//   });
// };
