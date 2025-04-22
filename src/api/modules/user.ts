import request from '../request'

// 定义类型
interface UserInfo {
  id: number
  name: string
  roles: string[]
}

// 用户登录
export const login = (data: { username: string; password: string }) =>
  request.post<string>('/user/login', data)

// 获取用户信息
export const getUserInfo = () =>
  request.get<UserInfo>('/user/info')

