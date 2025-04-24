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
  timeout: 10000,
  headers: new AxiosHeaders({
    'Content-Type': 'application/json'
  }),
  baseURL: import.meta.env.VITE_APP_BASE_API
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
    let token = null;
    const url = config.url;
    if(sessionStorage.getItem('accessToken') !== null && url?.indexOf('/newToken') === -1){
      token = sessionStorage.getItem('accessToken');
      config.headers["accessToken"] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error)
  }
)

const getNewToken = async () => {
 const url = "";
 let token = null;
 if(sessionStorage.getItem('refreshToken')!== null){
   token = JSON.parse(sessionStorage.getItem('refreshToken')!);
  }
  return await axios.get(url, { headers: { "accessToken": token }, isRefresh: true }) 
}

// 响应拦截器
request.interceptors.response.use(
  async (res: AxiosResponse) => {
    // 判断401状态码
    if (res.status === 401 && !res.config.isRefresh) {
      // 自动续期
      const res2 = await getNewToken();
      if(res2.data.code == 200){
        console.log("自动续期成功:" + new Date().toLocaleString());
        // 更新sessionStorage中相关token
        sessionStorage.setItem('accessToken', JSON.stringify(res2.data.data.accessToken));
        sessionStorage.setItem('refreshToken', JSON.stringify(res2.data.data.refreshToken));
        // 重新请求
        res = await axios.request(res.config);
      }
    }
      return res;
  },
  error => {
    // 错误处理...
    return Promise.reject(error)
  }
)
export default request