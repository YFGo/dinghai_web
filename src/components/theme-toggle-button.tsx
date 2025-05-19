import { Button } from 'antd'
import { useTheme } from '@/theme/ThemeContext'
import { SunFilled, MoonFilled } from '@ant-design/icons'

const ThemeToggleButton = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Button color="primary" onClick={toggleTheme} icon={isDark ? <MoonFilled /> : <SunFilled />}>
      {isDark ? '深色模式' : '浅色模式'}
    </Button>
  )
}

export default ThemeToggleButton
