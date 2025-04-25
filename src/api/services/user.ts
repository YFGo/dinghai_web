import request from '../request'

// 登录参数类型
export interface LoginParams {
  login_method: number
  password: string
  email: string
  phone: string
  code: string
}


export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn?: number // 建议添加过期时间
}

export interface UserInfo {
  id: number
  name: string
  roles: string[]
  avatar?: string // 建议补充完整用户字段
}


// 统一响应类型
interface BaseResponse<T> {
  code: number
  data: T
  message: string
}


const loginApi = (data: LoginParams) => {
    return request.post<BaseResponse<TokenPair>>('/wafUser/login', data)
}

const refreshToken = (refreshToken: string) => {
    return request.post<BaseResponse<TokenPair>>('/user/refreshToken', { refreshToken })
}

const getUserInfo = () => {
    return request.get<BaseResponse<UserInfo>>('/user/info')  
}

export { 
  loginApi, 
  refreshToken, 
  getUserInfo
}