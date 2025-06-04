import request from '../request'

// 新增服务器
export const addServer = (data: Object) => {
  return request.post('/serverWaf', data)
}

// 修改服务器
export const updateServer = (data: Object) => {
  return request.put('/serverWaf', data) 
}

// 删除服务器
export const deleteServer = (ids: React.Key[]) => {
  return request.delete('/serverWaf', { data: ids })
}

// 获取服务器详情
export const getServerDetail = (id: number) => {
  return request.get(`/serverWaf/${id}`) 
}

// 获取服务器列表
export const getServerList = (data: Object) => {
  return request.post('/serverWafs', data)
}

// 新增web程序
export const addWebApp = (data: Object) => {
  return request.post('/wafApp', data) 
}

// 修改web程序
export const updateWebApp = (data: Object) => {
  return request.put('/wafApp', data)
}