import { useState, useEffect } from 'react'
import { Row, Col, Card, Spin, Segmented } from 'antd'
import CountryTrafficCard from './country-traffic-card'

import TopCard from './top-card'
import EarthCard3D from './earth-card-3d'
import EarthCard2D from './earth-card-2d'
import TrackCard from './track-card'
import DetailCard from './detail-card'

export default function Dashboard() {
  const [loading, setLoading] = useState(false)
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
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen">
      <Spin spinning={loading}>
        <div className="space-y-4">
          {/* 顶部布局：TopCard 与 DetailCard 同级 */}
          <Row gutter={16}>
            {/* 左侧 TopCard（占满左侧空间） */}
            <Col span={16}>
              <TopCard />
            </Col>

            {/* 右侧 DetailCard（固定宽度） */}
            <Col span={8}>
              <DetailCard />
            </Col>
          </Row>

          {/* 下方可视化内容 */}
          <Row gutter={16}>
            <Col span={16}>
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

              <Card title="攻击类型分布" className="mt-4" loading={trackLoading}>
                <TrackCard />
              </Card>
            </Col>

            {/* 如果右侧下方需要留空，可以保持这个空 Col 或移除 */}
            <Col span={8}>{/* 右侧下方内容（如有需要） */}</Col>
          </Row>
        </div>
      </Spin>
    </div>
  )
}
