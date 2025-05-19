import { Card, Progress } from 'antd'

const CountryTrafficCard = () => {
  // 数据配置 - 可以轻松添加或修改国家数据
  const countryData = [
    { name: '中国', value: '4.4k', percent: 30 },
    { name: '美国', value: '3.2k', percent: 30 },
    { name: '英国', value: '2.1k', percent: 30 },
    { name: '荷兰', value: '1.5k', percent: 30 }
  ]

  return (
    <Card
      size="small"
      style={{ width: 300 }}
      title="国家访问量统计" // 添加标题更清晰
    >
      {countryData.map((country, index) => (
        <div key={index}>
          <div className="flex justify-between mb-1">
            <span>{country.name}</span>
            <span>{country.value}</span>
          </div>
          <Progress
            percent={country.percent}
            strokeColor={getProgressColor(index)} // 添加不同颜色区分
            showInfo={false} // 去掉百分比数字显示更简洁
            className="mb-4" // 增加间距
          />
        </div>
      ))}
    </Card>
  )
}

// 辅助函数：为不同进度条设置不同颜色
const getProgressColor = (index: number) => {
  const colors = ['#1890ff', '#13c2c2', '#722ed1', '#eb2f96']
  return colors[index % colors.length]
}

export default CountryTrafficCard
