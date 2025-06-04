import request from '../request'

// 新增策略
export const addStrategy = (data: Object) => {
  return request.post('/strategy', data)
}

// 修改策略
export const updateStrategy = (data: Object) => {
  return request.put('/strategy', data)
}

// 删除策略
export const deleteStrategy = (ids: React.Key[]) => {
  return request.delete('/strategy', { data: ids })
}

// 获取策略详情
export const getStrategyDetail = (id: number) => {
  return request.get(`/strategy/${id}`)
}

// 获取策略列表
export const getStrategyList = (data: Object) => {
  return request.post('/strategies', data)
}