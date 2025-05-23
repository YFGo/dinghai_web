import type { ThemeConfig } from 'antd'
import { theme } from 'antd'
// 明亮主题
export const lightTheme: ThemeConfig = {
  token: {
    colorBgLayout: '#f4f5f8', // 整体背景
    colorPrimary: '#0fc6c2', // 主色
    colorBgContainer: '#ffffff', // 内容区背景
    colorText: 'rgba(0, 0, 0, 0.88)', // 主要文字
    colorTextSecondary: 'rgba(0, 0, 0, 0.65)', // 次要文字
    colorBorder: '#d9d9d9' // 边框色
  },
  components: {
    Layout: {
      headerBg: '#ffffff', // Header背景
      siderBg: '#ffffff' // Sider背景
    },
    Menu: {
      itemBg: 'transparent', // 菜单项背景
      itemColor: 'rgba(0, 0, 0, 0.65)',
      itemHoverColor: '#0fc6c2'
    },
    Progress: {
      defaultColor: '#0fc6c2' // 进度条颜色
    }
  }
}

// 暗黑主题（黑金配色）
export const darkTheme: ThemeConfig = {
  token: {
    colorBgLayout: '#0a0a0a', // 整体背景
    colorPrimary: '#d4af37', // 金色主色
    colorBgContainer: '#141414', // 内容区背景
    colorText: 'rgba(255, 255, 255, 0.85)', // 主要文字
    colorTextSecondary: 'rgba(255, 255, 255, 0.65)', // 次要文字
    colorBorder: '#303030' // 边框色
  },
  components: {
    Layout: {
      headerBg: '#1d1d1d', // Header背景
      siderBg: '#1a1a1a' // Sider背景
    },
    Menu: {
      itemBg: '#1a1a1a', // 菜单项背景
      itemColor: 'rgba(255, 255, 255, 0.65)', // 菜单项文字颜色
      itemHoverColor: '#d4af37'
    },
    Progress: {
      defaultColor: '#d4af37' // 进度条颜色
    }
  },
  algorithm: theme.darkAlgorithm // 启用暗黑算法
}
