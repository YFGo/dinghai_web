// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// import path from 'path'


const root: string = process.cwd();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 环境变量
  const env = loadEnv(mode, root, "");
  return {
    // base的作用是: 配置应用的基础路径，用于指定应用在服务器上的相对路径。
    // 例如，如果你将 base 设置为 '/my-app/'，那么应用将被部署在服务器上的 '/my-app/' 路径下。
    base: env.REACT_APP_PUBLIC_PATH,
    plugins: [react()],
    resolve: {
      // 配置别名，用于简化导入路径。
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    server: {
      host: true,
      proxy: {
        "^/dev-api": {
          target: "http://marchbooks.a1.luyouxia.net:28638/app/user/v1",
          // 作用: 设置是否更改请求头中的 Origin 字段。
          // 默认 false。设置为 true 可以解决跨域问题。
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dev-api/, '')
        }
      }
    }
  }
})