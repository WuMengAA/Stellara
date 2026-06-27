<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const sidebarOpen = ref(false)

watch(() => route.path, () => { sidebarOpen.value = false })

const navGroups = [
  {
    label: 'Content',
    items: [
      { label: 'Dashboard', to: '/admin', icon: 'grid' },
      { label: 'Articles', to: '/admin/articles', icon: 'file-text' },
      { label: 'Tags', to: '/admin/tags', icon: 'tag' },
      { label: 'Comments', to: '/admin/comments', icon: 'message-square' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Users', to: '/admin/users', icon: 'users' },
      { label: 'Analytics', to: '/admin/analytics', icon: 'chart' },
      { label: 'Media', to: '/admin/media', icon: 'image' },
    ],
  },
]

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}
</script>

<template>
  <div class="min-h-screen flex" :class="[`theme-${useTheme().theme.value}`, `perf-${useTheme().perfMode.value}`]"
    style="background: var(--color-background); color: var(--color-foreground)">
    <aside class="fixed inset-y-0 left-0 z-40 w-56 border-r flex flex-col shrink-0"
      :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
      <div class="h-16 flex items-center gap-2 px-5 border-b" :style="{ borderColor: 'var(--color-border)' }">
        <NuxtLink to="/admin" class="flex items-center gap-2 text-base font-semibold tracking-tight"
          style="color: var(--color-foreground)">
          <span class="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] flex items-center justify-center text-white text-xs font-bold">S</span>
          Stellara
        </NuxtLink>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div v-for="group in navGroups" :key="group.label">
          <p class="text-[10px] font-semibold uppercase tracking-widest px-2 mb-2"
            style="color: var(--color-muted)">
            {{ group.label }}
          </p>
          <div class="space-y-0.5">
            <NuxtLink v-for="item in group.items" :key="item.to" :to="item.to"
              class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150"
              :class="isActive(item.to) ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : 'hover:bg-[var(--color-surface-2)]'"
              :style="{ color: isActive(item.to) ? 'var(--color-accent)' : 'var(--color-muted)' }">
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path v-if="item.icon === 'grid'" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                <path v-if="item.icon === 'file-text'" stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                <path v-if="item.icon === 'tag'" stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path v-if="item.icon === 'message-square'" stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                <path v-if="item.icon === 'users'" stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                <path v-if="item.icon === 'image'" stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                <path v-if="item.icon === 'chart'" stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>
      </nav>

      <div class="px-3 py-3 border-t" :style="{ borderColor: 'var(--color-border)' }">
        <div class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs" style="color: var(--color-muted)">
          <span class="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] flex items-center justify-center text-white text-[10px] font-medium">
            {{ auth.user?.name?.[0]?.toUpperCase() || 'U' }}
          </span>
          <span class="truncate flex-1">{{ auth.user?.name || 'Admin' }}</span>
        </div>
      </div>
    </aside>

    <div class="ml-56 flex-1 flex flex-col min-h-screen">
      <header class="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b backdrop-blur-lg"
        :style="{ background: 'var(--color-background)/80', borderColor: 'var(--color-border)' }">
        <div class="flex items-center gap-3">
          <button @click="sidebarOpen = true" class="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--color-surface-2)]"
            style="color: var(--color-muted)">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h1 class="text-sm font-semibold" style="color: var(--color-foreground)">
            <slot name="title">Dashboard</slot>
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="text-xs px-3 py-1.5 rounded-lg transition-colors"
            style="color: var(--color-muted); background: var(--color-surface-2)">
            ← View Site
          </NuxtLink>
          <button @click="auth.logout()" class="text-xs px-3 py-1.5 rounded-lg transition-colors"
            style="color: var(--color-muted); background: var(--color-surface-2)">
            Sign out
          </button>
        </div>
      </header>

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>

    <Teleport to="body">
      <div v-if="sidebarOpen" class="fixed inset-0 z-50 lg:hidden">
        <div class="absolute inset-0 bg-black/40" @click="sidebarOpen = false" />
        <aside class="absolute left-0 inset-y-0 w-56 border-r shadow-2xl overflow-y-auto"
          :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
          <div class="h-16 flex items-center gap-2 px-5 border-b" :style="{ borderColor: 'var(--color-border)' }">
            <span class="text-base font-semibold tracking-tight" style="color: var(--color-foreground)">Stellara</span>
          </div>
          <nav class="px-3 py-4 space-y-6">
            <div v-for="group in navGroups" :key="group.label">
              <p class="text-[10px] font-semibold uppercase tracking-widest px-2 mb-2" style="color: var(--color-muted)">
                {{ group.label }}
              </p>
              <div class="space-y-0.5">
                <NuxtLink v-for="item in group.items" :key="item.to" :to="item.to"
                  class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150"
                  :class="isActive(item.to) ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]' : ''"
                  :style="{ color: isActive(item.to) ? 'var(--color-accent)' : 'var(--color-muted)' }">
                  {{ item.label }}
                </NuxtLink>
              </div>
            </div>
          </nav>
        </aside>
      </div>
    </Teleport>
  </div>
</template>
