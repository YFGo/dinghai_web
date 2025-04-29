import request from '../request'
import { BaseResponse } from '@/types/response'


export type LoginMethod = 1 | 2 | 3

// 登录参数类型
export interface LoginParams {
  login_method: LoginMethod
  password: string // 密码登录时必填
  email: string // 邮箱登录时使用
  phone: string // 手机登录时必填
  code: string // 验证码登录时必填
}

// 注册参数类型
export interface RegisterParams {
  email: string
  code: string
  password: string
}

// Token响应结构
export interface TokenPair {
  access_token: string
  refresh_token: string
}

// 用户信息类型增强
export interface UserInfo {
  id: number
  username: string
  email: string
  phone: string
  roles: string[]
  avatar?: string
  created_at?: string // 建议补充完整字段
}

// 发送验证码参数类型
export interface SendCaptchaParams {
  user_email: string
  send_action: 'sign' | 'login' | 'reset_password'
}

// 人机校验信息
export interface CaptchaInfo {
  captcha_id: string
  master_image: string
  thumb_image: string
}

// -------------------- API 层 --------------------
const handleUserLogin = (data: LoginParams) => {
  return request.post<TokenPair>('/wafUser/login', data)
}

const refreshToken = (refreshToken: string) => {
  return request.post<TokenPair>('/user/refreshToken', { refreshToken })
}

const getUserInfo = () => {
  return request.get<BaseResponse>('/user/info')
}

// 获取人机校验信息
const getCaptcha = () => {
  return request.get<CaptchaInfo>('/waf/captchaRight', {
  }) 
}

// 提交人机校验
const submitCaptcha = (captcha_id: string, user_angle: number) => {
  return request.post<BaseResponse>(
    '/waf/captchaVerify',
    { captcha_id, user_angle },
  )
}

// 发送验证码
const sendCaptcha = (data: SendCaptchaParams) => {
  return request.get<BaseResponse>('/waf/code', { params: data })
}

// 用户注册
const registerUser = (data: RegisterParams) => {
  return request.post<BaseResponse>('/wafUser/signup', data) 
}

export { handleUserLogin, refreshToken, getUserInfo, getCaptcha, submitCaptcha,sendCaptcha, registerUser }


