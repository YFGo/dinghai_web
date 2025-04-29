import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Menu, theme, Row, Col, Card, Avatar, Dropdown, message, Spin, Space, Button } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, DownOutlined, VideoCameraOutlined, UploadOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import TopCard from './top-card'
import EarthCard from './earth-card'
import TrackCard from './track-card'
import DetailCard from './detail-card'

const { Header, Sider, Content } = Layout

export default function Dashboard() {
  // 定义导航钩子
  const navigate = useNavigate()

  // 定义状态管理
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [earthLoading, setEarthLoading] = useState(false)
  const [trackLoading, setTrackLoading] = useState(false)

  // 获取主题变量
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  // 定义菜单项
  const menuItems: MenuProps['items'] = [
    {
      label: (
        <a href="https://www.antgroup.com" target="_blank" rel="noopener noreferrer">
          1st menu item
        </a>
      ),
      key: '0'
    },
    {
      label: (
        <a href="https://www.aliyun.com" target="_blank" rel="noopener noreferrer">
          2nd menu item
        </a>
      ),
      key: '1'
    },
    {
      type: 'divider'
    },
    {
      label: '退出登录',
      key: '3'
    }
  ]

  // 菜单项点击处理函数
  const onClick: MenuProps['onClick'] = ({ key }) => {
    message.info(`Click on item ${key}`)
    if (key === '3') {
      navigate('/login')
    }
  }

  // 模拟数据获取
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // 这里替换为你的实际API地址
        // const response = await axios.get('/api/dashboard/stats');
        // setStatInfo(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // 空依赖数组表示只在组件挂载时执行一次

  return (
    <Layout className="min-h-screen">
      {/* 侧边栏 */}
      <Sider trigger={null} collapsed={collapsed} className="!fixed h-full z-50 shadow-xl" theme="dark">
        <div className="h-12 bg-black/20 flex items-center justify-center text-white text-lg font-bold">{collapsed ? 'LOGO' : '定海网络安全平台'}</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          className="pt-4 bg-[#001529]"
          items={[
            { key: '1', icon: <UserOutlined />, label: '威胁地图' },
            { key: '2', icon: <VideoCameraOutlined />, label: '攻击监控' },
            { key: '3', icon: <UploadOutlined />, label: '报表分析' }
          ]}
        />
      </Sider>

      {/* 主布局 */}
      <Layout className={`transition-all duration-300 ${collapsed ? 'pl-20' : 'pl-64'}`}>
        {/* 头部 */}
        <Header style={{ background: colorBgContainer }} className="!px-4 !h-16 flex justify-between items-center shadow-sm sticky top-0 z-40">
          <div>
            <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} className="!w-12 !h-12 flex items-center justify-center hover:!bg-gray-100" />
          </div>
          <div>
            <Dropdown
              menu={{
                items: menuItems,
                onClick
              }}
              trigger={['click']}>
              <a onClick={e => e.preventDefault()}>
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span>用户</span>
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>

        {/* 内容区域 */}
        <Content className="p-6 bg-gray-50 min-h-[calc(100vh-3rem)]">
          <Row gutter={[16, 16]}>
            {/* 地球可视化卡片 */}
            <Col span={16}>
              <TopCard />
              <Card className="rounded-xl shadow-sm my-3">
                {earthLoading ? (
                  <Spin />
                ) : (
                  <div>
                    <div className="text-2xl mb-4 font-bold">全球攻击分布</div>
                    <EarthCard />
                  </div>
                )}
              </Card>
              <Card>
                {trackLoading ? (
                  <Spin />
                ) : (
                  <div>
                    <div className="text-2xl mb-4 font-bold">攻击类型分布</div>
                    <TrackCard />
                  </div>
                )}
              </Card>
            </Col>
            {/* 实时统计卡片 */}
            <Col span={8} className="h-full">
              <div>
                <div className="text-2xl mb-4 font-bold">详细数据</div>
                <DetailCard />
              </div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  )
}
