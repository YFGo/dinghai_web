import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { Provider } from 'react-redux'
import { ThemeProvider, useTheme } from '@/theme/ThemeContext'
import Router from '@/router'
import store from '@/redux'
import './global.css'

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
