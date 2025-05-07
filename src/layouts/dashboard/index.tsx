import { Outlet } from 'react-router-dom'
import { UserOutlined, DownOutlined } from '@ant-design/icons'
import { clearToken } from '@/utils/storage.ts'
import { useNavigate } from 'react-router-dom'
import { Layout, theme, Avatar, Dropdown, message, Space } from 'antd'
import type { MenuProps } from 'antd'

import { usePermissionRoutes } from '@/router/hooks'
import SidebarMenu from './side-bar-menu'


const { Header, Content, Footer, Sider } = Layout

export default function DashboardLayout() {
  const navigate = useNavigate()

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
      navigate('/login')
    }
  }

  return (
    <Layout>
      {/* 侧面导航栏 */}
      <Sider width={200} collapsible>
        <div>
          ddjawjkldjkawkjlfaw😘
        </div>
        <SidebarMenu></SidebarMenu>
      </Sider>
      <Layout className='min-h-screen'>
        <Header className="bg-white shadow-sm flex items-center justify-between px-4">
          <div className="text-xl font-bold">工作台</div>
          <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={['click']} overlayClassName="w-40">
            <Space>
              <Avatar icon={<UserOutlined />} />
              <span>管理员</span>
              <DownOutlined />
            </Space>
          </Dropdown>
        </Header>
        <Content>
          {/* 路由内容 */}
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  )
}
