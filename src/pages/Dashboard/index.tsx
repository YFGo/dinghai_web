import { useState, useEffect } from 'react'
import { Row, Col, Card, Spin } from 'antd'

import TopCard from './top-card'
import EarthCard from './earth-card'
import TrackCard from './track-card'
import DetailCard from './detail-card'

export default function Dashboard() {
  const [loading, setLoading] = useState(false)
  const [earthLoading, setEarthLoading] = useState(false)
  const [trackLoading, setTrackLoading] = useState(false)

  // 模拟数据加载
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
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
              <Card title="全球攻击分布" loading={earthLoading}>
                <EarthCard />
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
