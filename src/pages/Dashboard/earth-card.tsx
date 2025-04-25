// EarthCard.tsx
import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import 'echarts-gl'
import earth from '@/assets/img/earth.jpg'
import starfield from '@/assets/img/starfield.jpg'

function EarthCard () {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)
    const option = {
      globe: {
        baseTexture: earth,
        shading: 'lambert',
        environment: starfield,
        atmosphere: {
          show: true
        },
        light: {
          ambient: {
            intensity: 0.1
          },
          main: {
            intensity: 1.5
          }
        }
      }
    }

    chart.setOption(option)

    // 清理函数
    return () => {
      chart.dispose()
    }
  }, [])

  return <div ref={chartRef} className="chart-container" />
}

export default EarthCard
