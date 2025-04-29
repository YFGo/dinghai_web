# 定海 - 网络安全智能管控平台

![shield-badge] ![license-badge] ![react-badge]

新一代Web应用安全网关管理系统，提供流量分析、攻击拦截、策略路由等核心安全能力。

## 🌟 核心功能
### 安全防护体系
- **实时攻击感知**  
  基于流量特征分析的DDoS/CC攻击识别
- **智能拦截引擎**  
  XSS/SQL注入/恶意爬虫等OWASP TOP10攻击防护
- **流量清洗**  
  异常流量自动分流与清洗策略管理

### 管控功能
- **策略路由**  
  支持基于地理围栏/IP信誉的智能路由
- **证书管理**  
  TLS证书全生命周期监控
- **审计日志**  
  操作日志追踪与安全事件回溯

### 可视化
- **威胁地图**  
  使用ECharts GL实现全球攻击源实时可视化
- **态势感知**  
  通过AntV图表展示实时流量波动与威胁等级

## 🛠 技术架构
### 前端技术栈
| 模块            | 技术方案                          |
|-----------------|----------------------------------|
| 框架核心        | React 18 + TypeScript 5          |
| 状态管理        | Redux Toolkit + React-Redux      |
| 可视化          | ECharts 5 + ECharts GL           |
| UI组件库        | Ant Design 5                     |
| 路由管理        | React Router 6                   |
| 安全验证        | go-captcha-react 验证码组件      |
| 构建工具        | Vite 6                           |

### 安全增强
- CSP内容安全策略白名单控制
- 关键操作二次身份验证
- 请求参数自动消毒处理
- JWT令牌自动刷新机制

## 🚀 快速开始
### 环境要求
- Node.js 18+
- Chrome 110+ / Firefox 108+

### 安装部署
```bash
# 克隆仓库
git clone https://security.example.com/dinhai-2.git

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产构建
pnpm build:prod

🔧 环境配置
创建 .env.production 文件：
# 安全策略
VITE_API_ENDPOINT=https://api.security.example.com
VITE_CAPTCHA_KEY=your_captcha_site_key
VITE_CDN_ENABLED=true

# 监控配置
VITE_SENTRY_DSN=your_sentry_dsn

📂 项目结构_带中文注释
dinhai-2/
├── public/
│   ├── favicon.ico // 网站图标
│   └── manifest.json // PWA 配置
├── src/
│   ├── api/ // 接口定义
│   ├── assets/ // 静态资源
│   ├── components/ // 通用组件
│   ├── hooks/ // 自定义钩子
│   ├── layouts/ // 布局组件
│   ├── pages/ // 页面组件
│   ├── router/ // 路由配置
│   ├── store/ // Redux 状态管理
│   ├── utils/ // 工具函数
│   ├── App.tsx // 应用入口
│   ├── main.tsx // 主渲染入口
│   ├── index.css // 全局样式
│   └── index.tsx // 入口文件
├── .env.development // 开发环境配置
├── .env.production // 生产环境配置
├── vite.config.ts // Vite 配置
├── tsconfig.json // TypeScript 配置
├── pnpm-lock.yaml // pnpm 锁文件
├── package.json // 依赖配置
├── README.md // 项目说明
└── .eslintrc.js // ESLint 配置


🛡 安全实践
输入验证
所有API请求参数经过JSON Schema验证

输出编码
使用DOMPurify对动态内容进行净化

限流防护
关键接口实现令牌桶限流算法

审计追踪
关键操作记录不可篡改日志

🤝 贡献指南
欢迎提交安全漏洞报告（请通过PGP加密）：
-----BEGIN PGP PUBLIC KEY BLOCK-----
定海项目安全团队公钥...


License
GNU General Public License v3.0

请根据实际项目情况调整以下内容：
1. 在"安全增强"部分补充具体实施方案
2. 完善"安全实践"中的技术细节
3. 添加系统架构图与威胁防护流程图
4. 替换示例中的密钥和证书占位符

建议配套添加以下安全文档：
1. SECURITY.md - 详细说明安全策略
2. THREAT-MODEL.md - 系统威胁模型分析
3. INCIDENT-RESPONSE.md - 安全事件响应流程