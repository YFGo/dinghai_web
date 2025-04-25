// Dashboard.tsx
import { useState } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Layout,Button,Menu,theme, Row, Col, Card, Typography } from 'antd'
import EarthCard from './earth-card' // 根据实际路径调整

const { Header, Sider, Content } = Layout
const { Title } = Typography



export default function Dashboard() {
    const [collapsed, setCollapsed] = useState(false)

      const {
        token: { colorBgContainer, borderRadiusLG }
      } = theme.useToken()

  return (
    <Layout className="dashboard-layout">
      <Sider trigger={null} collapsed={collapsed}>
        <div>Logo</div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'nav 1'
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2'
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3'
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64
            }}
          />
        </Header>
        <Content style={{ padding: '24px' }}>
          <Row gutter={24}>
            <Col span={16}>
              <EarthCard />
            </Col>

            <Col span={8}>
              <Card title="实时拦截统计" className="stats-card">
                <div className="stat-item">
                  <Title level={5}>全球攻击总数</Title>
                  <Title level={2}>1,234,567</Title>
                </div>
                <div className="stat-item">
                  <Title level={5}>今日拦截次数</Title>
                  <Title level={2}>23,456</Title>
                </div>
                <div className="stat-item">
                  <Title level={5}>高危攻击数量</Title>
                  <Title level={2} type="danger">
                    1,234
                  </Title>
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  )
}
