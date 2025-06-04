// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
// import path from 'path'
import { resolve } from 'path'

const root: string = process.cwd()

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 环境变量
  const env = loadEnv(mode, root, '')
  console.log(env.VITE_APP_ENV)

  console.log(env.VITE_APP_BASE_API, 2311111)

  return {
    // base的作用是: 配置应用的基础路径，用于指定应用在服务器上的相对路径。
    // 例如，如果你将 base 设置为 '/my-app/'，那么应用将被部署在服务器上的 '/my-app/' 路径下。
    base: env.VITE_APP_PUBLIC_PATH,
    plugins: [react()],
    css: {
      postcss: {
        plugins: [tailwindcss()]
      }
    },
    resolve: {
      // 设置文件./src路径为 @
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, './src')
        }
      ]
    },
    server: {
      host: true,
      proxy: {
        '/dev-api': {
          target: 'http://47.108.221.229:8002/app/user/v1',
          //  'http://8.154.36.180:8002/app/user/v1,'
          // 作用: 设置是否更改请求头中的 Origin 字段。
          // 默认 false。设置为 true 可以解决跨域问题。
          changeOrigin: true,
          rewrite: path => path.replace(/^\/dev-api/, '')
        }
      }
    }
  }
})


