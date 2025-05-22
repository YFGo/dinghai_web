import { useEffect, useRef } from 'react'
import earthFlyLine from 'earth-flyline'
import { useTheme } from '@/theme/ThemeContext'
import geojson from '@/assets/earth_map/world.json'

const EarthCard3D = () => {
  const containerRef = useRef(null)
  const chartRef = useRef<any>(null) // 用于保存图表实例
  const { earthTheme } = useTheme()

  const pointData = [
    {
      id: 1,
      lon: 112.45, //经度
      lat: 34.62 //维度
    }
  ]

  // 定义配置类型
  const getChartConfig = () => ({
    R: 160,
    bgStyle: {
      color: earthTheme.bgColor,
      opacity: 1
    },
    earth: {
      color: earthTheme.earthColor,
      material: 'MeshMatcapMaterial',
      dragConfig: {
        disableX: false,
        disableY: true
      }
    },
    mapStyle: {
      areaColor: earthTheme.mapAreaColor,
      lineColor: earthTheme.mapLineColor
    },
    spriteStyle: {
      color: earthTheme.spriteColor,
      size: 2.5,
      show: true,
    },
    hoverRegionStyle: {
      areaColor: earthTheme.highlightColor,
      show: false
    },
    pathStyle: {
      color: earthTheme.pathColor,
      show: true
    },
    flyLineStyle: {
      color: earthTheme.flyLineColor,
      duration: 2000,
      delay: 0,
      repeat: Infinity,
      onComplete: params => {}
    },
    scatterStyle: {
      color: earthTheme.scatterColor,
      size: 140 * 0.05,
      duration: 2000,
      delay: 0,
      repeat: Infinity,
      onComplete: params => {}
    },
    wallStyle: {
      color: earthTheme.highlightColor,
      opacity: 0.5
    },
    regions: {
      China: {}
    }
  })

  // 初始化或重新初始化地球图表
  const initChart = () => {
    // 先销毁现有实例
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    // 注册地图
    earthFlyLine.registerMap('world', geojson as any)

    // 初始化新图表
    chartRef.current = earthFlyLine.init({
      dom: containerRef.current,
      map: 'world',
      rotateSpeed: 0.0007,
      light: 'DirectionalLight',
      config: getChartConfig()
    })

    chartRef.current.addData('point', pointData)
  }

  // 首次渲染和主题变化时初始化图表
  useEffect(() => {
    initChart()

    // 组件卸载时销毁实例
    return () => {
      chartRef.current?.destroy()
    }
  }, [earthTheme]) // 依赖 earthTheme，当它变化时会重新执行

  return <div ref={containerRef} className="h-[500px] w-[680px] rounded-md truncate shadow-sm" />
}

export default EarthCard3D
