import { useState, useEffect } from 'react'
import { Row, Col, Card, Spin, Segmented } from 'antd'
import CountryTrafficCard from './country-traffic-card'

import TopCard from './top-card'
import EarthCard3D from './earth-card-3d'
import EarthCard2D from './earth-card-2d'
import TrackCard from './track-card'
import DetailCard from './detail-card'

export default function Dashboard() {
  const [trackLoading, setTrackLoading] = useState(false)

  const [viewMode, setViewMode] = useState<'world' | 'china'>('world')
  const [displayMode, setDisplayMode] = useState<'3D' | '2D'>('3D')

  const handleViewModeChange = (value: string) => {
    setViewMode(value.toLowerCase() as 'world' | 'china')
  }

  const handleDisplayModeChange = (value: string) => {
    setDisplayMode(value as '3D' | '2D')
  }

  // 模拟数据加载
  useEffect(() => {
    // 获取数据
  }, [])

  return (
    // className="min-h-screen"
    <div>
      <div className="space-y-4">
        <Row gutter={16}>
          {/* 左侧 */}
          <Col span={16}>
            <Row gutter={[0,10]}>
              {/* 上方数据看板 */}
              <Col span={24}>
                <TopCard />
              </Col>

              {/* 下方可视化内容 */}
              <Col span={24}>
                <Card title="全球攻击分布">
                  <div className="flex space-x-4 justify-between">
                    {/* 动态切换3D/2D地球 */}
                    {displayMode === '3D' ? <EarthCard3D /> : <EarthCard2D />}
                    {/* 数据看板 */}
                    <div className="flex flex-col items-end">
                      <div className="mb-12">
                        <span className="mr-4">
                          <Segmented<string> options={['3D', '2D']} defaultValue="3D" onChange={handleDisplayModeChange} />
                        </span>
                        <span>
                          <Segmented<string> options={['世界', '中国']} defaultValue="世界" onChange={handleViewModeChange} />
                        </span>
                      </div>
                      <div>
                        <CountryTrafficCard />
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* 攻击轨迹 */}
              {/* <Col span={24}>
                <Card title="攻击类型分布" loading={trackLoading}>
                  <TrackCard />
                </Card>
              </Col> */}
            </Row>
          </Col>
          {/* 右侧 DetailCard（固定宽度） */}
          <Col span={8}>
            <DetailCard />
          </Col>
        </Row>
      </div>
    </div>
  )
}
