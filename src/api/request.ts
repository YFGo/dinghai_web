import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { getToken, setToken, removeToken } from '@/utils/storage'
import { ResultEnum } from '@/types/enum'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 刷新状态控制
let isRefreshing = false
let requests: (() => void)[] = []

// 请求拦截器
// 当请求 URL 不是刷新 Token 的接口时，才携带 Authorization 头
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  let token = getToken('access_token')
  if (token && !config.url?.includes('/waf/refreshToken')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const data= response.data
    // Relfect.has() 方法判断对象是否包含指定的属性
    const isSuccess = data && Reflect.has(data, 'code') && data.code === ResultEnum.SUCCESS        
    if (isSuccess) {
      return data
    } else {
      return Promise.reject(response.data)
    }
  },

  async error => {
    const originalRequest = error.config
    
    // 处理 401 错误
    // _retry 确保每个 401 错误的请求最多只尝试刷新一次 Token
    // 只与前端有关,防止因 Token 刷新失败导致的无限重试循环
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true

        try {
          const refresh_token = getToken('refresh_token')
          const { data } = await axios.post('/waf/refreshToken', { refresh_token })

          setToken('access_token', data.access_token)
          setToken('refresh_token', data.refresh_token)

          // 重试队列中的请求
          requests.forEach(cb => cb())
          requests = []
          return request(originalRequest)
        } catch (e) {
          removeToken('access_token')
          removeToken('refresh_token')
          window.location.href = '/login'
          return Promise.reject(e)
        } finally {
          isRefreshing = false
        }
      }

      // 将请求加入队列
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(originalRequest))
        })
      })
    }
    return Promise.reject(error)
  }
)

export default request
