import { useEffect, useRef, useState } from 'react'
import earthFlyLine from 'earth-flyline'

import geojson from '@/assets/earth_map/world.json'

const EarthCard = () => {
  // type: flyLine(飞线) | point(点) | road(路径) | wall(三维的立体结构) | mapStreamLine(动态流线) | bar(柱状图)

  const containerRef = useRef(null)

  // 存储当前选中的区域的key
  const [currentRegionKey, setCurrentRegionKey] = useState<string | null>(null)

  const pointData = [
    {
      id: 1,
      lon: 112.45, //经度
      lat: 34.62 //维度
    }
  ]

  // 定义配置类型
  const chartConfig = {
    R: 140,
    earth: {
      color: '#13162c',
      dragConfig: {
        disableX: false, //是否禁用x轴旋转
        disableY: true //是否禁用y轴旋转
      }
    },
    mapStyle: {
      areaColor: '#2e3564',
      lineColor: '#797eff'
    },
    // 光圈配置
    spriteStyle: {
      color: '#797eff'
      // show: true //是否展示光圈
    },
    // 飞线路径配置
    pathStyle: {
      color: '#cd79ff',
      show: true
    },
    // 蝌蚪飞线配置
    flyLineStyle: {
      color: '#cd79ff',
      duration: 2000, // 一个完成动画所需时间(单位毫秒)，值越小动画速度越快
      delay: 0, //延迟执行时间默认
      repeat: Infinity, //循环次数 无限循环
      onComplete: params => {
        //当repeat循环次数用尽之后的回调 当repeat为无限循环 则永不触发
        //do something
      }
    },
    // 涟漪配置
    scatterStyle: {
      color: '#cd79ff',
      size: 140 * 0.05, //涟漪的尺寸 默认为 半径R*0.05
      duration: 2000, // 一个完成动画所需时间(单位毫秒)，值越小动画速度越快
      delay: 0, //延迟执行时间默认
      repeat: Infinity, //循环次数 无限循环
      onComplete: params => {
        //当repeat循环次数用尽之后的回调 当repeat为无限循环 则永不触发
        //do something
      }
    },
    // 鼠标悬浮区域
    hoverRegionStyle: {
      areaColor: '#cd79ff',
      opacity: 1,
      show: false
    },
    // 地图区域
    regions: {
      China: {
        // areaColor: '#1677ff' //区域颜色
      }
    }
  }

  // 首次渲染时初始化图表
  useEffect(() => {
    // 注册地图
    earthFlyLine.registerMap('world', geojson as any)

    // 初始化图表
    const chart = earthFlyLine.init({
      dom: containerRef.current,
      map: 'world',
      rotateSpeed: 0.0007, //旋转速度
      config: chartConfig
    })

    // 处理点击事件
    chart.on('click', (event, params) => {
      console.log('点击事件', event);
      
      if (params) {
           const regionName = params.name
        if (regionName) {
        }
      }
    })

    chart.addData('point', pointData)

    // 组件卸载时销毁实例
    return () => {
      chart?.destroy()
    }
  }, [])

  return <div ref={containerRef} className="h-[600px] rounded-md truncate shadow-sm" />
}

export default EarthCard
