# 文档库设计文档

## 概述

在 Stellara 中增加一个文档库子系统，支持以 IDE 文件夹树的形式组织系列文档。文档库既可独立写文档，也可收录现有文章，提供模板加速创建。

## 核心模型

### Series（系列）
顶层容器，每个系列是一组文档的集合。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String (cuid) | 主键 |
| title | String | 系列名称 |
| slug | String (unique) | URL 友好标识 |
| description | String | 简短描述 |
| icon | String (default: "📚") | 系列图标 |
| coverImage | String? | 封面图 |
| authorId | String | 创建者 |
| isPublic | Boolean (default: true) | 是否公开 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### Doc（文档/文件夹）
自引用树形结构，既是文件夹也是叶子节点。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String (cuid) | 主键 |
| seriesId | String | 所属系列 |
| parentId | String? | 父文件夹（自引用） |
| title | String | 文档/文件夹名 |
| slug | String | 同系列内唯一 |
| type | "doc" \| "folder" | 节点类型 |
| content | String (default: "") | markdown 内容（type=doc） |
| order | Int (default: 0) | 同级排序 |
| template | String (default: "blank") | 创建时使用的模板 |
| articleId | String? | 关联的现有文章 ID（可选收录） |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

> `@@unique([seriesId, slug])` — 同系列内 slug 唯一

## 内置模板

| key | 名称 | 预填纲要 |
|-----|------|---------|
| blank | 空白文档 | 空内容 |
| api-ref | API 参考 | `## 概述\n## 请求\n## 响应\n## 错误码\n## 示例` |
| guide | 教程指南 | `## 前置要求\n## 步骤\n## 说明` |
| note | 笔记随笔 | `## 背景\n## 正文` |

模板在创建文档时选择，创建后预填到 content 字段，与普通文档无区别。

## 页面路由

| 路径 | 说明 |
|------|------|
| /docs | 系列列表页，卡片式展示 |
| /docs/[seriesSlug] | 系列内页，左侧文件树 + 右侧内容/编辑器 |
| /docs/[seriesSlug]/new | 新建文档/文件夹（两步式第一步） |
| /docs/[seriesSlug]/edit/[docId] | 编辑文档内容（两步式第二步） |

## API 路由

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/series | 系列列表 |
| POST | /api/series | 创建系列 |
| GET | /api/series/[slug] | 系列详情（含文档树） |
| PATCH | /api/series/[slug] | 更新系列 |
| DELETE | /api/series/[slug] | 删除系列 |
| GET | /api/series/[slug]/docs | 文档列表（平铺含 content） |
| POST | /api/series/[slug]/docs | 创建文档/文件夹 |
| GET | /api/series/[slug]/docs/[docId] | 单篇文档 |
| PATCH | /api/series/[slug]/docs/[docId] | 更新文档 |
| DELETE | /api/series/[slug]/docs/[docId] | 删除文档 |

## 两步式编辑流程

1. 用户在 /docs 页点击「新建系列」或选择已有系列
2. 进入系列页，左侧显示文件树，右侧初始空白
3. 点击「新建」→ 选择类型（文档/文件夹）+ 模板 → POST /api/series/[slug]/docs
4. 创建后文件树更新，点击文档节点 → 加载内容到右侧
5. 点击「编辑」→ 跳转到 /docs/[slug]/edit/[docId] 全屏编辑器
6. 保存 → PATCH 更新 → 返回系列页

## 与文章系统的关系

- Doc 可选关联 Article（articleId 字段）
- 关联后文档库中显示链接标记，可一键跳转或基于文章创建文档
- 文章本身的编辑不受影响

## 设计决策

1. **树形结构自引用**：Doc 的 parentId 自引用实现无限嵌套，避免复杂闭包表
2. **两步式编辑**：先创建（选位置/模板）→ 再编辑内容，降低初次使用的心智负担
3. **模板仅初次**：模板仅创建时预填 content，之后与普通文档无异，保持编辑一致性
4. **收录而非依赖**：articleId 是可选关联，文档库和文章系统相互独立
