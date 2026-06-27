<p align="center">
  <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20starry%20night%20sky%20with%20soft%20aurora%20and%20a%20subtle%20crescent%20moon%2C%20dreamy%20pastel%20colors%2C%20anime-style%20illustration&image_size=landscape_16_9" alt="Stellara" width="100%" />
</p>

<h1 align="center">✦ Stellara ✦</h1>

<p align="center">
  <b>自部署个人博客 + 轻量级 CMS</b><br>
  一个长得好看、能写博客、能建文档库、能换皮肤的个人网站
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-3.21-00DC82?logo=nuxt" alt="Nuxt 3">
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js" alt="Vue 3">
  <img src="https://img.shields.io/badge/SQLite-003B57?logo=sqlite" alt="SQLite">
</p>

---

## ✨ 功能

| 模块 | 说明 |
|------|------|
| **📝 博客系统** | 文章管理、标签分类、评论互动、SEO 元信息、RSS 订阅 |
| **📚 文档库** | 树形结构化文档，支持拖拽排序、markdown 渲染、从已有文章收录 |
| **🎨 主题系统** | 5 套主题 × 深浅色模式，支持模糊/辉光/动效/粒子等个性化调节 |
| **⚡ 性能预设** | 从画质优先到极限省电，多级控制 |
| **🔐 用户体系** | JWT 登录、角色权限、API Key 鉴权 |
| **📊 管理后台** | 仪表盘、文章/评论/标签/媒体管理、数据统计 |

## 🛠 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Nuxt 3.21 |
| UI | Vue 3.5 |
| ORM | Prisma 6 + SQLite |
| 认证 | JWT (jose) + bcrypt |
| Markdown | markdown-it + highlight.js |
| 状态管理 | Pinia |
| 样式 | Tailwind CSS + CSS 自定义属性 |

## 🚀 快速开始

```bash
npm install
npx prisma db push
npm run dev     # → http://localhost:3000
```

## 📋 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run dev:push` | 同步数据库 |
| `npm run dev:studio` | 数据库管理界面 |

## 📁 项目结构

```
stellara-nuxt/
├── assets/css/        # 全局样式 & 主题变量
├── components/        # Vue 组件
├── composables/       # 共享逻辑 (useTheme, useMarkdown, useSeries)
├── layouts/           # 布局模板 (default, admin)
├── pages/             # 路由页面
│   ├── admin/         # 管理后台
│   ├── blog/          # 博客
│   ├── docs/          # 文档库
│   └── ... 
├── prisma/            # 数据模型
├── server/            # API 路由 & 中间件
├── stores/            # Pinia 状态
└── nuxt.config.ts
```

## 🎨 主题

| 主题 | 默认模式 |
|------|---------|
| Dawn 🌅 | 浅色 |
| Stellara 🌌 | 深色 |
| Sakura 🌸 | 浅色 |
| Mint 🌿 | 浅色 |
| Ocean 🌊 | 深色 |

所有主题均支持深浅切换。更多调节：模糊强度、辉光度、动效速度、粒子密度、字体缩放、紧凑模式、5 级性能预设。

## 🔐 环境变量

```env
DATABASE_URL="file:./data/stellara.db"
JWT_SECRET="your-secret"
```

## 📄 License

MIT
