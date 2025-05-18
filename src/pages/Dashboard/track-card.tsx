import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import axios from 'axios'

interface PieData {
  name: string
  value: number
}

function TrackCard() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [pieData, setPieData] = useState<PieData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 创建取消令牌后，可以在发送请求时将其 token 属性传递给 Axios，从而关联该请求与取消令牌。
    // 在某个条件触发时取消请求,当前的应用场景是在组件卸载时取消未完成的请求。
    const cancelToken = axios.CancelToken.source()

    const fetchData = async () => {
      try {
        const formattedData = [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]

        setPieData(formattedData)
      } catch (error) {
        const err = error as Error
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    return () => {
      cancelToken.cancel('组件卸载取消请求')
    }
  }, [])

  useEffect(() => {
    if (!chartRef.current || pieData.length === 0) return

    const chart = echarts.init(chartRef.current)

    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: pieData // 使用动态数据
        }
      ]
    }

    chart.setOption(option)

    // 窗口大小变化时自适应
    const resizeHandler = () => chart.resize()
    window.addEventListener('resize', resizeHandler)

    return () => {
      chart.dispose()
      window.removeEventListener('resize', resizeHandler)
    }
  }, [pieData]) // 数据变化时重新渲染图表

  if (loading) return <div className="text-center py-4">加载中...</div>
  if (error) return <div className="text-red-500 p-4">错误: {error}</div>

  return (
    <div className="relative">
      <div ref={chartRef} className="h-[600px] rounded-xl shadow-sm" />

      {/* 可添加数据更新时间显示 */}
      <div className="absolute top-2 right-4 text-sm text-gray-500">最后更新: {new Date().toLocaleTimeString()}</div>
    </div>
  )
}
export default TrackCard
