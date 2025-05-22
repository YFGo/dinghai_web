import request from '../request'

// 定义接口
export interface AbnormalRequest {
  id: string
  timestamp: string
  ip: string
  url: string
  type: string
  status: string
}

export interface DailyStats {
  start_time: string
  end_time: string
}

export interface SiteAbnormal {
  start_time: string
  end_time: string
  page_now: string
  page_size: string
}


export interface AbnormalIP {
  start_time: string
  end_time: string
}

export interface AttackLog {
  id: string
  timestamp: string
  ip: string
  url: string
  type: string
  details: string
  severity: 'high' | 'medium' | 'low'
}



// 获取当日异常请求以及IP数
export const getAbnormalRequests = () => {
  return request.get<AbnormalRequest>('/attack/dataView')
}

// 根据日期获取异常请求数据变化(start_time,end_time)
export const getAbnormalRequestsByRange = (params: DailyStats) => {
  return request.get('/attack/dataView', { params })
}

// 获取站点异常请求信息
export const getSiteAbnormalRequests = (params: SiteAbnormal) => {
  return request.get('/attack/servers', { params })
}

// 获取异常IP地址
export const getAbnormalIPs = (params: AbnormalIP) => {
  return request.get('/attack/IPAddr', { params })
}

// 获取攻击日志详情
export const getAttackLogs = (log_id:string) => {
  return request.get<AttackLog>(`/attack/detail${log_id}`)
}