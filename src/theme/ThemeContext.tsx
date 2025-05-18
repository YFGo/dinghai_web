import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import type { ThemeConfig } from 'antd'
import { lightTheme, darkTheme } from './index'

type ThemeContextType = {
  isDark: boolean
  toggleTheme: () => void
  currentTheme: ThemeConfig
}

const defaultContextValue: ThemeContextType = {
  isDark: false,
  toggleTheme: () => console.warn('No ThemeProvider found'),
  currentTheme: lightTheme
}

const ThemeContext = createContext<ThemeContextType>(defaultContextValue)

// 从 localStorage 读取保存的主题偏好
const getInitialTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('themePreference')
    return savedTheme === 'dark'
  }
  return false
}

export const ThemeProvider = ({
  children,
  defaultDark = getInitialTheme() // 默认从 localStorage 读取
}: {
  children: React.ReactNode
  defaultDark?: boolean
}) => {
  const [isDark, setIsDark] = useState(defaultDark)

  // 切换主题并保存到 localStorage
  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newTheme = !prev
      localStorage.setItem('themePreference', newTheme ? 'dark' : 'light')
      return newTheme
    })
  }, [])

  // 初始化时检查系统偏好
  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
    }

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.addEventListener('change', handleSystemThemeChange)

    return () => {
      systemDark.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  const contextValue = useMemo(
    () => ({
      isDark,
      toggleTheme,
      currentTheme: isDark ? darkTheme : lightTheme
    }),
    [isDark, toggleTheme]
  )

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
