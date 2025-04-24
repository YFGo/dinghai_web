// src/api/modules/user.ts
import request from '../request'
import type { TokenPair, UserInfo } from "@/api/types/auth"
import type { LoginParams } from '@/api/types/user';


// 统一响应类型
interface BaseResponse<T> {
  code: number
  data: T
  message: string
}

export const authApi = {
  // 用户登录
  login: (data: LoginParams) => {
    return request.post<BaseResponse<TokenPair>>('/wafUser/login', data)
  },
    
  // 刷新Token
  refreshToken: (refreshToken: string) => {
    return request.post<BaseResponse<TokenPair>>('/user/refreshToken', { refreshToken })
  },

  // 获取用户信息
  getUserInfo: () => {
    request.get<BaseResponse<UserInfo>>('/user/info')
  }
}