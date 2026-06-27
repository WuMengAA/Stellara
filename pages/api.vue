<script setup lang="ts">
const theme = useTheme()
const authEndpoints = [
  { method: 'POST', path: '/api/auth/register', desc: '注册' },
  { method: 'POST', path: '/api/auth/login', desc: '登录' },
  { method: 'POST', path: '/api/auth/refresh', desc: '刷新令牌' },
]
const articleEndpoints = [
  { method: 'GET', path: '/api/articles', desc: '文章列表' },
  { method: 'POST', path: '/api/articles', desc: '创建文章' },
  { method: 'GET', path: '/api/articles/:id', desc: '文章详情' },
  { method: 'PATCH', path: '/api/articles/:id', desc: '更新文章' },
  { method: 'DELETE', path: '/api/articles/:id', desc: '删除文章' },
  { method: 'POST', path: '/api/articles/:id/view', desc: '增加阅读' },
]
const commentEndpoints = [
  { method: 'GET', path: '/api/comments', desc: '评论列表' },
  { method: 'POST', path: '/api/comments', desc: '发表评论' },
  { method: 'PATCH', path: '/api/comments/:id', desc: '审核评论' },
  { method: 'DELETE', path: '/api/comments/:id', desc: '删除评论' },
]
const userEndpoints = [
  { method: 'GET', path: '/api/users', desc: '用户列表' },
  { method: 'GET', path: '/api/users/me', desc: '当前用户' },
  { method: 'PATCH', path: '/api/users/:id', desc: '更新资料' },
  { method: 'DELETE', path: '/api/users/:id', desc: '删除用户' },
  { method: 'GET', path: '/api/tags', desc: '标签列表' },
]
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <div class="text-center space-y-3 pt-4">
      <h1 class="text-3xl md:text-4xl font-bold">API 文档</h1>
      <p class="text-sm" style="color: var(--color-muted)">Stellara 后端 RESTful API 概览</p>
    </div>

    <div class="ab-card">
      <h2 class="ab-h">认证方式</h2>
      <div class="space-y-2 text-sm mb-4">
        <p><strong style="color:var(--color-accent)">API Key</strong> — 适合第三方服务调用</p>
        <p class="text-xs" style="color: var(--color-muted)">在请求头添加 <code style="background:var(--color-surface);padding:.125rem .375rem;border-radius:4px">x-api-key: your-api-key</code></p>
        <p class="text-xs" style="color: var(--color-muted)">VoiceHub 已接入：<code style="background:var(--color-surface);padding:.125rem .375rem;border-radius:4px">vhub_0bbcd3d0e147b99a6e8deb6bd4929a77</code> (admin) / <code style="background:var(--color-surface);padding:.125rem .375rem;border-radius:4px">vhub_8ac527e00b3fb48a0c5470f20002897e</code> (user)</p>
        <hr class="my-2" style="border-color:var(--color-border)" />
        <p><strong>Bearer Token</strong> — 适合前端登录会话</p>
        <p class="text-xs" style="color: var(--color-muted)">在请求头添加 <code style="background:var(--color-surface);padding:.125rem .375rem;border-radius:4px">Authorization: Bearer your-jwt</code></p>
      </div>
      <h2 class="ab-h">认证端点</h2>
      <div class="space-y-3">
        <div v-for="e in authEndpoints" :key="e.path" class="api-row">
          <span class="api-method" :class="e.method">{{ e.method }}</span>
          <code class="api-path">{{ e.path }}</code>
          <span class="api-desc">{{ e.desc }}</span>
        </div>
      </div>
    </div>

    <div class="ab-card">
      <h2 class="ab-h">文章</h2>
      <div class="space-y-3">
        <div v-for="e in articleEndpoints" :key="e.path" class="api-row">
          <span class="api-method" :class="e.method">{{ e.method }}</span>
          <code class="api-path">{{ e.path }}</code>
          <span class="api-desc">{{ e.desc }}</span>
        </div>
      </div>
    </div>

    <div class="ab-card">
      <h2 class="ab-h">评论</h2>
      <div class="space-y-3">
        <div v-for="e in commentEndpoints" :key="e.path" class="api-row">
          <span class="api-method" :class="e.method">{{ e.method }}</span>
          <code class="api-path">{{ e.path }}</code>
          <span class="api-desc">{{ e.desc }}</span>
        </div>
      </div>
    </div>

    <div class="ab-card">
      <h2 class="ab-h">用户</h2>
      <div class="space-y-3">
        <div v-for="e in userEndpoints" :key="e.path" class="api-row">
          <span class="api-method" :class="e.method">{{ e.method }}</span>
          <code class="api-path">{{ e.path }}</code>
          <span class="api-desc">{{ e.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.ab-card {
  padding: 1.25rem; border-radius: 16px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 50%, transparent);
  backdrop-filter: blur(8px);
}
.ab-h {
  font-size: .75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .08em; color: var(--color-muted); margin-bottom: 1rem;
}
.api-row {
  display: flex; align-items: center; gap: .75rem;
  font-size: .8125rem;
}
.api-method {
  font-size: .625rem; font-weight: 700; padding: .125rem .375rem;
  border-radius: 4px; min-width: 44px; text-align: center;
}
.api-method.GET { background: rgba(16,185,129,0.15); color: #10b981; }
.api-method.POST { background: rgba(59,130,246,0.15); color: #3b82f6; }
.api-method.PATCH { background: rgba(234,179,8,0.15); color: #eab308; }
.api-method.DELETE { background: rgba(239,68,68,0.15); color: #ef4444; }
.api-path { font-family: 'SF Mono', monospace; color: var(--color-foreground); }
.api-desc { font-size: .75rem; color: var(--color-muted); margin-left: auto; }
</style>
