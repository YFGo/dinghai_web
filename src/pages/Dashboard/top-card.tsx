import { Card, Col, Row } from 'antd'
import { useState, useEffect } from 'react'

function TopCard() {
  const [statInfo, setStatInfo] = useState([
    {
      id: 1,
      title: 1111,
      content: '今日拦截攻击'
    },
    {
      id: 2,
      title: 1111,
      content: '今日拦截攻击'
    },
    {
      id: 3,
      title: 1111,
      content: '今日拦截攻击'
    },
    {
      id: 4,
      title: 1111,
      content: '今日拦截攻击'
    }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 这里替换为你的实际API地址
        // const response = await axios.get('/api/dashboard/stats')
        // setStatInfo(response.data)
      } catch (error) {
        console.error('Error fetching statistics:', error)
        // 可以在这里添加错误处理逻辑
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // 空依赖数组表示只在组件挂载时执行一次

  if (loading) {
    return <div>Loading...</div> // 可以替换为更漂亮的loading组件
  }

  return (
    <Row gutter={16}>
      {statInfo.map(({ id, title, content }) => (
        <Col span={24 / statInfo.length} key={id}>
          <Card title={title}>{content}</Card>
        </Col>
      ))}
    </Row>
  )
}

export default TopCard