import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders
} from 'axios'

// AxiosRequestConfig → InternalAxiosRequestConfig
// 使用 Axios 1.x + 的内部配置类型 InternalAxiosRequestConfig 来定义请求配置。

// 创建实例时指定默认类型
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: new AxiosHeaders({
    'Content-Type': 'application/json'
  })
})

// 增强类型声明
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    // 添加自定义配置项
    noToken?: boolean
    retryCount?: number
  }
}

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers) {
      config.headers = new AxiosHeaders()
    }

    // 安全操作 headers
    if (!config.noToken) {
      const token = localStorage.getItem('token')
      config.headers.set('Authorization', `Bearer ${token}`, true)
    }

    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  error => {
    // 错误处理...
    console.log(error);
    
  }
)
export default request