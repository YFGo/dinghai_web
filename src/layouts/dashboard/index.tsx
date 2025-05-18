import { useState } from'react'
import { Outlet } from 'react-router-dom'
import { UserOutlined, DownOutlined,MenuFoldOutlined,MenuUnfoldOutlined,SafetyOutlined } from '@ant-design/icons'
import { clearToken } from '@/utils/storage.ts'
import { useRouter } from '@/router/hooks/use-router'
import { Layout, theme, Avatar, Dropdown, message, Space, Typography, Button } from 'antd'
import type { MenuProps } from 'antd'
import ThemeToggleButton from '@/components/ThemeToggleButton'
import SidebarMenu from './side-bar-menu'


const { Header, Content, Footer, Sider } = Layout
const { Title } = Typography

export default function DashboardLayout() {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const toggle = () => {
    setCollapsed(!collapsed)
  }

  const {
    token: { colorBgContainer }
  } = theme.useToken()

  // 用户操作菜单
  const menuItems: MenuProps['items'] = [
    {
      label: '个人中心',
      key: 'profile',
      icon: <UserOutlined />
    },
    {
      type: 'divider'
    },
    {
      label: '退出登录',
      key: 'logout',
      danger: true
    }
  ]

  // 菜单点击处理
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      message.success('已退出登录')
      clearToken()
      router.push('/login')
    }
  }

  return (
    <Layout>
      {/* 侧面导航栏 */}
      <Sider width={200} collapsed={collapsed}>
        <div className="h-16 px-4 flex items-center overflow-hidden">
          <SafetyOutlined className="text-3xl mb-2 ml-2" />
          {!collapsed && (
            <Title level={4} className="ml-2 whitespace-nowrap transition-all duration-300" style={{ opacity: collapsed ? 0 : 1, marginLeft: collapsed ? 0 : '0.5rem' }}>
              定海WAF
            </Title>
          )}
        </div>
        <SidebarMenu />
      </Sider>
      <Layout className="min-h-screen">
        <Header className=" shadow-sm flex items-center justify-between px-4">
          <div>
            <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={toggle} />
            <span className="text-xl font-bold">工作台</span>
          </div>
          <div>
            <span className="mr-4">
              <ThemeToggleButton />
            </span>
            <span>
              <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={['click']} overlayClassName="w-40">
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <span>管理员</span>
                  <DownOutlined />
                </Space>
              </Dropdown>
            </span>
          </div>
        </Header>
        <Content className="p-3">
          {/* 路由内容 */}
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>定海安全管理平台@2025</Footer>
      </Layout>
    </Layout>
  )
}
