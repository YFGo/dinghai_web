import { useEffect, useRef } from 'react'
import earthFlyLine from 'earth-flyline'
import geojson from '@/assets/earth_map/world.json'

const EarthCard = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    // 注册地图
    earthFlyLine.registerMap('world', geojson as any)

    // 初始化图表
    const chart = earthFlyLine.init({
      dom: containerRef.current,
      map: 'world',
      config: {
        R: 140,
        earth: {
          color: '#13162c'
        },
        mapStyle: {
          areaColor: '#2e3564',
          lineColor: '#797eff'
        },
        spriteStyle: {
          color: '#797eff'
        },
        pathStyle: {
          color: '#cd79ff'
        },
        flyLineStyle: {
          color: '#cd79ff'
        },
        scatterStyle: {
          color: '#cd79ff'
        },
        hoverRegionStyle: {
          areaColor: '#cd79ff'
        },
        regions: {
          China: {
            areaColor: '#2e3564'
          }
        }
      }
    })

    // 组件卸载时销毁实例
    return () => {
      chart?.destroy()
    }
  }, [])

  return (
      <div ref={containerRef} className="h-[600px] rounded-md truncate shadow-sm" />
  )
}

export default EarthCard
