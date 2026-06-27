<script setup lang="ts">
const route = useRoute()
const auth = useAuthStore()
const router = useRouter()
const searchOpen = ref(false)
const searchQuery = ref('')

function nav(to: string) { router.push(to) }

function doSearch() {
  if (searchQuery.value.trim()) {
    router.push(`/blog?q=${encodeURIComponent(searchQuery.value.trim())}`)
    searchOpen.value = false
    searchQuery.value = ''
  }
}
</script>

<template>
  <div class="mn-wrap">
    <Transition name="mn-srch">
      <div v-if="searchOpen" class="mn-search-overlay" @click.self="searchOpen = false">
        <form @submit.prevent="doSearch" class="mn-search-form">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="searchQuery" ref="searchInput" placeholder="搜索文章…" class="mn-search-input" @keydown.esc="searchOpen = false" />
        </form>
      </div>
    </Transition>

    <nav class="mn-bar">
      <button @click="nav('/')" class="mn-item" :class="{ active: route.path === '/' }">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>首页</span>
      </button>
      <button @click="nav('/blog')" class="mn-item" :class="{ active: route.path.startsWith('/blog') }">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <span>博客</span>
      </button>
      <button @click="searchOpen = !searchOpen" class="mn-item mn-search-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <span>搜索</span>
      </button>
      <button @click="auth.isLoggedIn ? nav(`/profile/${auth.user.id}`) : nav('/login')" class="mn-item" :class="{ active: route.path.startsWith('/profile') }">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>{{ auth.isLoggedIn ? auth.user?.name?.[0] || '我' : '登录' }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.mn-wrap { display: none; }
@media (max-width: 639px) { .mn-wrap { display: block; } }

.mn-bar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 1050;
  display: flex; align-items: center; justify-content: space-around;
  height: 56px; padding-bottom: env(safe-area-inset-bottom, 0);
  background: color-mix(in srgb, var(--color-surface) 88%, transparent);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-top: 1px solid var(--color-border);
}
.mn-item {
  display: flex; flex-direction: column; align-items: center; gap: 1px;
  padding: 4px 12px; border: none; background: transparent; cursor: pointer;
  color: var(--color-muted); font-size: 10px; transition: color .2s;
}
.mn-item.active { color: var(--color-accent); }
.mn-item:active { transform: scale(.92); }

.mn-search-overlay {
  position: fixed; inset: 0; z-index: 1060;
  background: color-mix(in srgb, var(--color-background) 85%, transparent);
  backdrop-filter: blur(8px);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 4rem 1rem;
}
.mn-search-form {
  display: flex; align-items: center; gap: .5rem;
  width: 100%; max-width: 400px; padding: .75rem 1rem;
  border-radius: 14px; border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 8px 32px rgba(0,0,0,.15);
}
.mn-search-input {
  flex: 1; border: none; outline: none; background: transparent;
  color: var(--color-foreground); font-size: .9375rem;
}
.mn-search-input::placeholder { color: var(--color-muted); }

.mn-srch-enter-active, .mn-srch-leave-active { transition: all .2s ease; }
.mn-srch-enter-from, .mn-srch-leave-to { opacity: 0; }
</style>
