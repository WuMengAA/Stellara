<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const open = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const handleClick = (e: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
      open.value = false
    }
  }
  document.addEventListener('mousedown', handleClick)
  onUnmounted(() => document.removeEventListener('mousedown', handleClick))
})

watch(() => route.path, () => { open.value = false })

const badge = computed(() => {
  const u = auth.user
  if (!u) return { label: '访客', color: '#94a3b8', bg: 'rgba(148,163,184,0.2)' }
  if (u.role === 'admin') return { label: '管理员', color: '#a78bfa', bg: 'rgba(167,139,250,0.2)' }
  return { label: '用户', color: '#10b981', bg: 'rgba(16,185,129,0.2)' }
})

function navTo(path: string) {
  open.value = false
  router.push(path)
}
</script>

<template>
  <div v-if="auth.user" ref="dropdownRef" class="pd-outer">
    <button class="pd-trigger" @click="open = !open">
      <span class="pd-avatar">{{ auth.user.name?.[0]?.toUpperCase() || 'U' }}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
        class="pd-chevron" :class="{ rotated: open }">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

    <Transition name="pd">
      <div v-if="open" class="pd-menu">
        <!-- user header -->
        <div class="pd-header">
          <span class="pd-name">{{ auth.user.name }}</span>
          <span class="pd-badge" :style="{ background: badge.bg, color: badge.color }">
            {{ badge.label }}
          </span>
          <div class="pd-stats">
            <div class="pd-stat">
              <span class="pd-stat-val">{{ auth.isAdmin ? '∞' : '0' }}</span>
              <span class="pd-stat-lbl">文章</span>
            </div>
            <div class="pd-stat">
              <span class="pd-stat-val">0</span>
              <span class="pd-stat-lbl">评论</span>
            </div>
            <div class="pd-stat">
              <span class="pd-stat-val">0</span>
              <span class="pd-stat-lbl">阅读</span>
            </div>
          </div>
        </div>

        <!-- personal -->
        <div class="pd-section">
          <p class="pd-sec-label">个人</p>
          <button class="pd-item" @click="navTo(`/profile/${auth.user.id}`)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            我的主页
          </button>
        </div>

        <!-- admin -->
        <div v-if="auth.isAdmin" class="pd-section">
          <p class="pd-sec-label">管理</p>
          <button class="pd-item" @click="navTo('/admin')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>
          <button class="pd-item" @click="navTo('/admin/articles')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            文章管理
          </button>
          <button class="pd-item" @click="navTo('/admin/comments')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            评论管理
          </button>
          <button class="pd-item" @click="navTo('/admin/tags')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            标签管理
          </button>
          <button class="pd-item" @click="navTo('/admin/users')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            用户管理
          </button>
        </div>

        <!-- logout -->
        <div class="pd-section" style="border-top:1px solid var(--color-border);padding-top:0.375rem;margin-top:0.25rem">
          <button class="pd-item pd-logout" @click="auth.logout()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            退出登录
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pd-outer { position: relative; }
.pd-trigger {
  display: flex; align-items: center; gap: 2px;
  padding: 2px 4px 2px 2px; border-radius: 999px;
  border: none; background: transparent; cursor: pointer;
  color: var(--color-muted); transition: background .2s;
}
.pd-trigger:hover { background: color-mix(in srgb, var(--color-foreground) 8%, transparent); }

.pd-avatar {
  width: 28px; height: 28px; border-radius: 999px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 10px; font-weight: 700;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-accent) 25%, transparent);
}
.pd-chevron { transition: transform .3s ease; }
.pd-chevron.rotated { transform: rotate(180deg); }

.pd-menu {
  position: absolute; right: 0; top: calc(100% + 6px);
  width: 280px; z-index: 100;
  background: color-mix(in srgb, var(--color-panel) 92%, transparent);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid var(--color-border-strong);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(3, 2, 16, 0.35), inset 0 1px 0 rgba(255,255,255,.08);
  overflow: hidden;
}

.pd-header {
  display: flex; flex-direction: column; align-items: center;
  padding: 1rem 1rem .75rem; gap: .375rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
}
.pd-name { font-size: .9375rem; font-weight: 700; color: var(--color-primary); }
.pd-badge {
  font-size: .6875rem; padding: .125rem .625rem; border-radius: 999px;
  font-weight: 500;
}
.pd-stats {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: .375rem; width: 100%; margin-top: .5rem;
}
.pd-stat {
  display: flex; flex-direction: column; align-items: center;
  padding: .375rem; border-radius: 8px;
  background: color-mix(in srgb, var(--color-accent) 6%, transparent);
}
.pd-stat-val { font-size: .8125rem; font-weight: 700; color: var(--color-foreground); }
.pd-stat-lbl { font-size: .625rem; color: var(--color-muted); text-transform: uppercase; letter-spacing: .04em; }

.pd-section { padding: .375rem .5rem; }
.pd-sec-label {
  font-size: .625rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: .06em; color: color-mix(in srgb, var(--color-muted) 60%, transparent);
  padding: .25rem .5rem .125rem;
}
.pd-item {
  display: flex; align-items: center; gap: .5rem;
  width: 100%; padding: .5rem .625rem;
  border: none; border-radius: 10px;
  background: transparent; color: var(--color-foreground);
  font-size: .8125rem; cursor: pointer;
  transition: background .15s;
}
.pd-item:hover { background: color-mix(in srgb, var(--color-accent) 10%, transparent); }
.pd-item svg { color: var(--color-accent); flex-shrink: 0; }
.pd-logout { color: #ef4444; }
.pd-logout svg { color: #ef4444; }
.pd-logout:hover { background: rgba(239,68,68,0.1); }

.pd-enter-active, .pd-leave-active { transition: all .2s cubic-bezier(0.22,1,0.36,1); }
.pd-enter-from, .pd-leave-to { opacity: 0; transform: translateY(-4px) scale(.96); }
</style>
