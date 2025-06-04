import request from '../request'

// 获取白名单列表
export const getWhiteList = (data: Object) => {
  return request.post('/allows', data)
}

// 获取白名单详情
export const getWhiteListDetail = (id: number) => {
  return request.get(`/allow/${id}`)
}

// 新增白名单
export const addWhiteList = (data: Object) => {
  return request.post('/allow', data)
}

// 修改白名单
export const updateWhiteList = (data: Object) => {
  return request.put('/allow', data)
}

// 删除白名单
export const deleteWhiteList = (ids: React.Key[]) => {
  return request.delete('/allow', { data: ids })  
}