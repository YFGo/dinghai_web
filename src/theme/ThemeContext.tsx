import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import type { ThemeConfig } from 'antd'
import { lightTheme, darkTheme } from './index'

// 定义地球主题配置
interface EarthThemeConfig {
  bgColor: string
  earthColor: string
  mapAreaColor: string
  mapLineColor: string
  highlightColor: string
  pathColor: string
  flyLineColor: string
  scatterColor: string
  spriteColor: string
}

// 定义主题上下文类型
type ThemeContextType = {
  isDark: boolean
  toggleTheme: () => void
  currentTheme: ThemeConfig
  earthTheme: EarthThemeConfig
}

// 默认上下文值
const defaultContextValue: ThemeContextType = {
  isDark: false,
  toggleTheme: () => console.warn('No ThemeProvider found'),
  currentTheme: lightTheme,
  earthTheme: {
    bgColor: '#fff',
    earthColor: '#040D21',
    mapAreaColor: '#013e87',
    mapLineColor: '#516aaf',
    highlightColor: '#02fff6',
    pathColor: '#7aaae9',
    flyLineColor: '#02fff6',
    scatterColor: '#02fff6',
    spriteColor: '#138cdf'
  }
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType>(defaultContextValue)

// 定义不同主题的地球主题配置

// 深蓝科技风（推荐）
const EarthTheme1: EarthThemeConfig = {
  bgColor: '#f0f4f9', // 浅蓝灰背景
  earthColor: '#204070', // 深蓝地球底色
  mapAreaColor: '#1a4a7a', // 中等蓝地图区域
  mapLineColor: '#4d8bc8', // 亮蓝地图边界线
  highlightColor: '#00e6ff', // 青色高亮
  pathColor: '#5d9cec', // 中等蓝路径
  flyLineColor: '#00e6ff', // 青色飞线
  scatterColor: '#00e6ff', // 青色涟漪
  spriteColor: '#3d8ee8' // 亮蓝光圈
}

// 浅蓝科技风
const EarthTheme2: EarthThemeConfig = {
  bgColor: '#f5f9ff', // 浅蓝白背景
  earthColor: '#d4e6ff', // 浅蓝地球底色（类似白天地球）
  mapAreaColor: '#a8c8f0', // 浅蓝地图区域
  mapLineColor: '#6d9ce8', // 中蓝边界线
  highlightColor: '#3aa9ff', // 亮蓝高亮
  pathColor: '#7aaae9', // 中蓝路径
  flyLineColor: '#3aa9ff', // 亮蓝飞线
  scatterColor: '#3aa9ff', // 亮蓝涟漪
  spriteColor: '#5d9cec' // 光圈颜色
}

// 自然地球风
const EarthTheme3: EarthThemeConfig = {
  bgColor: '#f5f9ff',
  earthColor: '#0d2b52',
  mapAreaColor: '#2c6e8f', // 海洋蓝
  mapLineColor: '#5d8fb4',
  highlightColor: '#00d4ff',
  pathColor: '#6ba8d9',
  flyLineColor: '#00d4ff',
  scatterColor: '#00d4ff',
  spriteColor: '#4a9bd6'
}

// 柔和渐变风
const EarthTheme4: EarthThemeConfig = {
  bgColor: '#f8fafd',
  earthColor: '#122c4e',
  mapAreaColor: '#3a7ca5', // 柔和的蓝绿色
  mapLineColor: '#7db4ca',
  highlightColor: '#00e1ff',
  pathColor: '#68a7d8',
  flyLineColor: '#00e1ff',
  scatterColor: '#00e1ff',
  spriteColor: '#5ca3d6'
}

// 高对比度科技风
const EarthTheme5: EarthThemeConfig = {
  bgColor: '#ffffff',
  earthColor: '#0c162d',
  mapAreaColor: '#1a3d6c',
  mapLineColor: '#3d7cb8',
  highlightColor: '#00f9ff',
  pathColor: '#4d9ae8',
  flyLineColor: '#00f9ff',
  scatterColor: '#00f9ff',
  spriteColor: '#2d8ae5'
}

// 浅灰白配色（极简风）
const EarthTheme6: EarthThemeConfig = {
  bgColor: '#ffffff', // 纯白背景
  earthColor: '#e6eef7', // 浅灰蓝地球
  mapAreaColor: '#c0d4e8', // 浅灰蓝地图
  mapLineColor: '#8fa8c7', // 灰蓝边界
  highlightColor: '#4d8bc8', // 中蓝高亮
  pathColor: '#7aaae9', // 路径颜色
  flyLineColor: '#4d8bc8', // 飞线颜色
  scatterColor: '#4d8bc8', // 涟漪颜色
  spriteColor: '#6d9ce8' // 光圈颜色
}

// 黑金主题（黑客帝国风格）
const EarthTheme7: EarthThemeConfig = {
  bgColor: '#0a0a0a', // 纯黑背景
  earthColor: '#252525', // 中灰地球（比背景亮）
  mapAreaColor: '#808080', // 比地球稍亮的区域
  mapLineColor: '#5a5a5a', // 更亮的边界线
  highlightColor: '#ffd700', // 金色高亮（保持鲜明）
  pathColor: '#ffaa00', // 金色路径
  flyLineColor: '#ffd700', // 金色飞线
  scatterColor: '#ffd700', // 金色涟漪
  spriteColor: '#ffaa00' // 金色光圈
}

// 黑绿主题（黑客终端风格）
const EarthTheme8: EarthThemeConfig = {
  bgColor: '#000000', // 纯黑背景
  earthColor: '#1a1a1a', // 深灰地球（带绿调）
  mapAreaColor: '#1f2a1f', // 暗绿地图区域
  mapLineColor: '#3a4d3a', // 亮绿边界线
  highlightColor: '#00ff00', // 亮绿高亮
  pathColor: '#00cc00', // 中绿路径
  flyLineColor: '#00ff00', // 亮绿飞线
  scatterColor: '#00ff00', // 亮绿涟漪
  spriteColor: '#00cc00' // 光圈颜色
}

// 红黑主题（攻防对抗风格）
const EarthTheme9: EarthThemeConfig = {
  bgColor: '#0a0a0a', // 纯黑背景
  earthColor: '#251a1a', // 深红灰地球
  mapAreaColor: '#352525', // 红灰地图区域
  mapLineColor: '#5a3a3a', // 亮红灰边界
  highlightColor: '#ff3333', // 亮红高亮
  pathColor: '#ff5555', // 中红路径
  flyLineColor: '#ff3333', // 亮红飞线
  scatterColor: '#ff3333', // 亮红涟漪
  spriteColor: '#ff5555' // 光圈颜色
}

const lightEarthTheme: EarthThemeConfig = {
  bgColor: '#fff',
  earthColor: '#040D21',
  mapAreaColor: '#013e87',
  mapLineColor: '#516aaf',
  highlightColor: '#02fff6',
  pathColor: '#7aaae9',
  flyLineColor: '#02fff6',
  scatterColor: '#02fff6',
  spriteColor: '#138cdf' 
}
const darkEarthTheme: EarthThemeConfig = {
  bgColor: '#040D21',
  earthColor: '#040D21',
  mapAreaColor: '#013e87',
  mapLineColor: '#516aaf',
  highlightColor: '#02fff6',
  pathColor: '#7aaae9',
  flyLineColor: '#02fff6',
  scatterColor: '#02fff6',
  spriteColor: '#138cdf' 
}

// 获取初始主题
const getInitialTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('themePreference')
    return savedTheme === 'dark'
  }
  return false
}

// 主题提供者
export const ThemeProvider = ({ children, defaultDark = getInitialTheme() }: { children: React.ReactNode; defaultDark?: boolean }) => {
  const [isDark, setIsDark] = useState(defaultDark)

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newTheme = !prev
      localStorage.setItem('themePreference', newTheme ? 'dark' : 'light')
      return newTheme
    })
  }, [])

  // 监听系统主题变化
  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
    }
    // 初始化时检查系统主题
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.addEventListener('change', handleSystemThemeChange)
    // 组件卸载时移除监听器
    return () => {
      systemDark.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])
  // 创建上下文值
  const contextValue = useMemo(
    () => ({
      isDark,
      toggleTheme,
      currentTheme: isDark ? darkTheme : lightTheme,
      earthTheme: isDark ? EarthTheme7 : EarthTheme1
    }),
    [isDark, toggleTheme]
  )
  // 渲染上下文提供器
  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

// 自定义钩子，用于获取主题上下文
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
