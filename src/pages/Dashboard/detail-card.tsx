
import { useState, useEffect, useRef } from 'react'
import { Card, DatePicker, Table, List, Tag, Tabs, Spin, Empty, Button } from 'antd'
import type { TabsProps } from 'antd'
import * as echarts from 'echarts'
import { AlertOutlined, GlobalOutlined, WarningOutlined } from '@ant-design/icons'
import { DailyStats, AbnormalIP, SiteAbnormal,AttackLog } from '@/api/services/attack'
import { getAbnormalRequests } from '@/api/services/attack'


const DetailCard = () => {
  // 状态定义
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [dailyStats, setDailyStats] = useState({
    abnormalRequests: 0,
    abnormalIPs: 0,
    date: new Date().toISOString().split('T')[0]
  })
  const [trendData, setTrendData] = useState<{date: string, count: number}[]>([])
  const [abnormalIPs, setAbnormalIPs] = useState<AbnormalIP[]>([])
  const [siteAbnormals, setSiteAbnormals] = useState<SiteAbnormal[]>([])
  const [attackLogs, setAttackLogs] = useState<AttackLog[]>([])
  
  // 图表引用
  const trendChartRef = useRef<HTMLDivElement>(null)
  
  // 获取当日异常请求和IP数量
  useEffect(() => {
    const fetchDailyStats = async () => {
      setLoading(true)
      try {
        // 获取当日数据
        const res = getAbnormalRequests()
        // 模拟数据
        const mockData = {
          abnormalRequests: 1258,
          abnormalIPs: 47,
          date: selectedDate.toISOString().split('T')[0]
        }

        
        setDailyStats(mockData)
      } catch (error) {
        console.error('获取每日统计数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDailyStats()
  }, [selectedDate])
  
  // 获取异常请求趋势数据
  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        // 模拟API调用
        // const response = await axios.get(`/api/security/trends?date=${selectedDate.toISOString().split('T')[0]}`)
        // 模拟数据 - 最近7天的趋势
        const mockData = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          return {
            date: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 500) + 800
          }
        })
        
        setTrendData(mockData)
      } catch (error) {
        console.error('获取趋势数据失败:', error)
      }
    }
    
    fetchTrendData()
  }, [selectedDate])
  
  // 获取站点异常请求信息
  useEffect(() => {
    const fetchSiteAbnormals = async () => {
      try {
        // 模拟API调用
        // const response = await axios.get(`/api/security/site-abnormals?date=${selectedDate.toISOString().split('T')[0]}`)
        // 模拟数据
        const mockData = [
          { site: 'example.com', count: 532, percentage: 42 },
          { site: 'test-site.org', count: 321, percentage: 25 },
          { site: 'demo.net', count: 245, percentage: 19 },
          { site: 'other-site.cn', count: 160, percentage: 14 }
        ]
        
        // setSiteAbnormals(mockData)
      } catch (error) {
        console.error('获取站点异常数据失败:', error)
      }
    }
    
    fetchSiteAbnormals()
  }, [selectedDate])
  
  // 获取异常IP地址
  useEffect(() => {
    const fetchAbnormalIPs = async () => {
      try {
        // 模拟API调用
        // const response = await axios.get(`/api/security/abnormal-ips?date=${selectedDate.toISOString().split('T')[0]}`)
        // 模拟数据
        const mockData = [
          { ip: '192.168.1.1', count: 156, lastSeen: '2023-06-15 14:23:45', threat: '扫描攻击', location: '中国' },
          { ip: '10.0.0.5', count: 89, lastSeen: '2023-06-15 13:12:33', threat: 'SQL注入', location: '美国' },
          { ip: '172.16.0.1', count: 67, lastSeen: '2023-06-15 12:45:21', threat: 'XSS攻击', location: '俄罗斯' },
          { ip: '8.8.8.8', count: 45, lastSeen: '2023-06-15 11:32:10', threat: 'DDOS', location: '德国' },
        ]
        
        // setAbnormalIPs(mockData)
      } catch (error) {
        console.error('获取异常IP数据失败:', error)
      }
    }
    
    fetchAbnormalIPs()
  }, [selectedDate])
  
  // 获取攻击日志详情
  useEffect(() => {
    const fetchAttackLogs = async () => {
      try {
        // 模拟API调用
        // const response = await axios.get(`/api/security/attack-logs?date=${selectedDate.toISOString().split('T')[0]}`)
        // 模拟数据
        const mockData = [
          { id: 'log001', timestamp: '2023-06-15 14:23:45', ip: '192.168.1.1', url: '/admin/login', type: 'SQL注入', details: '尝试通过SQL注入绕过登录验证', severity: 'high' },
          { id: 'log002', timestamp: '2023-06-15 13:12:33', ip: '10.0.0.5', url: '/user/profile', type: 'XSS攻击', details: '尝试注入恶意JavaScript代码', severity: 'medium' },
          { id: 'log003', timestamp: '2023-06-15 12:45:21', ip: '172.16.0.1', url: '/api/data', type: '未授权访问', details: '尝试访问未授权API端点', severity: 'medium' },
          { id: 'log004', timestamp: '2023-06-15 11:32:10', ip: '8.8.8.8', url: '/search', type: '命令注入', details: '尝试通过搜索框注入系统命令', severity: 'high' },
        ] as AttackLog[]
        
        setAttackLogs(mockData)
      } catch (error) {
        console.error('获取攻击日志失败:', error)
      }
    }
    
    fetchAttackLogs()
  }, [selectedDate])
  
  // 渲染趋势图表
  useEffect(() => {
    if (!trendChartRef.current || trendData.length === 0) return
    
    const chart = echarts.init(trendChartRef.current)
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: trendData.map(item => item.date.substring(5)), // 只显示月-日
        axisLabel: {
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 10
        }
      },
      series: [
        {
          name: '异常请求数',
          type: 'bar',
          barWidth: '60%',
          data: trendData.map(item => item.count),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          }
        }
      ]
    }
    
    chart.setOption(option)
    
    // 窗口大小变化时自适应
    const resizeHandler = () => chart.resize()
    window.addEventListener('resize', resizeHandler)
    
    return () => {
      // 组件卸载时销毁图表
      chart.dispose()
      // 移除事件监听器
      window.removeEventListener('resize', resizeHandler)
    }
  }, [trendData])
  
  // 渲染站点异常分布
  const renderSiteAbnormals = () => {
    return (
      <List
        size="small"
        dataSource={siteAbnormals}
        // renderItem={item => (
        //   <List.Item>
        //     <div className="flex justify-between w-full">
        //       <span className="text-sm">{item.site}</span>
        //       <div>
        //         <span className="text-sm mr-2">{item.count}次</span>
        //         <Tag color="blue">{item.percentage}%</Tag>
        //       </div>
        //     </div>
        //   </List.Item>
        // )}
      />
    )
  }
  
  // 渲染异常IP列表
  const renderAbnormalIPs = () => {
    return (
      <List
        size="small"
        dataSource={abnormalIPs}
        // renderItem={item => (
        //   <List.Item>
        //     <div className="flex justify-between w-full">
        //       <div>
        //         <span className="text-sm font-medium">{item.ip}</span>
        //         <Tag color="red" className="ml-2">{item.threat}</Tag>
        //       </div>
        //       <div className="text-xs text-gray-500">
        //         <span>{item.count}次</span>
        //         <span className="ml-2">{item.location}</span>
        //       </div>
        //     </div>
        //   </List.Item>
        // )}
      />
    )
  }
  
  // 渲染攻击日志
  const renderAttackLogs = () => {
    return (
      <List
        size="small"
        dataSource={attackLogs}
        renderItem={item => (
          <List.Item>
            <div className="w-full">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{item.type}</span>
                <Tag color={item.severity === 'high' ? 'red' : item.severity === 'medium' ? 'orange' : 'green'}>
                  {item.severity === 'high' ? '高危' : item.severity === 'medium' ? '中危' : '低危'}
                </Tag>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <span>{item.timestamp}</span>
                <span className="mx-2">|</span>
                <span>{item.ip}</span>
              </div>
              <div className="text-xs mt-1 text-gray-700">
                <span>URL: {item.url}</span>
              </div>
              <div className="text-xs mt-1 text-gray-600 bg-gray-50 p-1 rounded">
                {item.details}
              </div>
            </div>
          </List.Item>
        )}
      />
    )
  }
  
  // 定义Tab项
  const tabItems: TabsProps['items'] = [
    {
      key: 'sites',
      label: (
        <span>
          <GlobalOutlined />
          站点异常
        </span>
      ),
      children: renderSiteAbnormals(),
    },
    {
      key: 'ips',
      label: (
        <span>
          <WarningOutlined />
          异常IP
        </span>
      ),
      children: renderAbnormalIPs(),
    },
    {
      key: 'logs',
      label: (
        <span>
          <AlertOutlined />
          攻击日志
        </span>
      ),
      children: renderAttackLogs(),
    },
  ]
  
  return (
    <Card
      title="安全监控详情"
      extra={
        <DatePicker 
          onChange={(date) => date && setSelectedDate(date.toDate())} 
          allowClear={false}
          size="small"
        />
      }
      className="h-full"
    >
      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Spin tip="加载中..." />
        </div>
      ) : (
        <div className="space-y-4">
          {/* 当日统计数据 */}
          <div className="flex justify-between bg-blue-50 p-3 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{dailyStats.abnormalRequests}</div>
              <div className="text-xs text-gray-500">异常请求</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{dailyStats.abnormalIPs}</div>
              <div className="text-xs text-gray-500">异常IP</div>
            </div>
          </div>
          
          {/* 异常请求趋势图 */}
          <div>
            <div className="text-sm font-medium mb-2">异常请求趋势</div>
            <div ref={trendChartRef} className="h-[120px] w-full" />
          </div>
          
          {/* 详细数据标签页 */}
          <div>
            <Tabs items={tabItems} size="small" />
          </div>
          
          {/* 查看更多按钮 */}
          <div className="text-center">
            <Button type="link" size="small">查看更多详情</Button>
          </div>
        </div>
      )}
    </Card>
  )
}

export default DetailCard
