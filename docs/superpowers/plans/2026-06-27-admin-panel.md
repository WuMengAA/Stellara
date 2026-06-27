# Admin Panel - Implementation Plan

## File Map

```
middleware/admin.ts              → Auth guard
layouts/admin.vue                → Sidebar + topbar layout
pages/admin/index.vue            → Dashboard stats + recent articles
pages/admin/articles/index.vue   → Article list + search + filter
pages/admin/articles/new.vue     → Markdown editor (create)
pages/admin/articles/[id].edit.vue → Markdown editor (edit)
pages/admin/tags.vue             → Tag CRUD table
pages/admin/comments.vue         → Comment moderation
pages/admin/users.vue            → User management
```

## Execution Order

1. **middleware/admin.ts** — 路由守卫，检查 auth store
2. **layouts/admin.vue** — 侧边栏 + 顶栏，供所有 admin 页面共用
3. **pages/admin/index.vue** — Dashboard，4 个统计卡片 + 最近文章表格
4. **pages/admin/articles/index.vue** — 文章列表，搜索 + 状态筛选 + 表格操作
5. **pages/admin/articles/new.vue** + **pages/admin/articles/[id].edit.vue** — Markdown 分栏编辑器
6. **pages/admin/tags.vue** — 标签管理
7. **pages/admin/comments.vue** — 评论审核
8. **pages/admin/users.vue** — 用户管理

## Dependencies

- `useApi()` composable — 已存在，用于 authenticated fetch
- `useMarkdown()` composable — 已存在，用于编辑器预览
- `useTheme()` composable — 已存在，主题切换
- `stores/auth.ts` — 已存在，isAdmin 判断
- All API endpoints under `/api/*` — 已存在，无需新增
