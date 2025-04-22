// src/api/modules/user.ts
import request from '../request'
import type { TokenPair, UserInfo } from "../types/auth"

// 登录参数类型
type LoginParams =
  | { login_method: 1; phone: string; code: string }
  | { login_method: 2; email: string; password: string }
  | { login_method: 3; phone: string; password: string }

// 统一响应类型
interface BaseResponse<T> {
  code: number
  data: T
  message: string
}

export const authApi = {
  // 用户登录
  login: (data: LoginParams) =>
    request.post<BaseResponse<TokenPair>>('/wafUser/login', data),

  // 刷新Token
  refreshToken: (refreshToken: string) =>
    request.post<BaseResponse<TokenPair>>('/user/refreshToken', { refreshToken }),

  // 获取用户信息
  getUserInfo: () =>
    request.get<BaseResponse<UserInfo>>('/user/info')
}