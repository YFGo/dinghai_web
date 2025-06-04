import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { Provider } from 'react-redux'
import { ThemeProvider, useTheme } from '@/theme/ThemeContext'
import Router from '@/router'
import store from '@/redux'
import './global.css'

// ThemeContext 是上下文的定义，ThemeProvider 是上下文的实现。它们相辅相成，共同实现了在组件树中共享主题状态的功能。
const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  )
}

// AppContent.tsx
const AppContent = () => {
  const { currentTheme } = useTheme()
  return (
    <ConfigProvider locale={zhCN} theme={currentTheme}>
      <Router />
    </ConfigProvider>
  )
}

export default App
