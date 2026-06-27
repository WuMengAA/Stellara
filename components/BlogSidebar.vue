<script setup lang="ts">
const { data: tags } = await useFetch('/api/tags')
const { data: articles } = await useFetch('/api/articles?perPage=20&sort=views')
const auth = useAuthStore()

const tagList = computed(() => (tags.value as any)?.data || [])
const articleList = computed(() => (articles.value as any)?.data?.articles || [])
const popular = computed(() => [...articleList.value].sort((a: any, b: any) => (b.viewCount||0) - (a.viewCount||0)).slice(0, 5))
const recent = computed(() => articleList.value.slice(0, 4).filter((a: any) => !popular.value.find((p: any) => p.id === a.id)))
const totalViews = computed(() => articleList.value.reduce((s: number, a: any) => s + (a.viewCount||0), 0))
</script>

<template>
  <aside class="space-y-6">
    <!-- Author -->
    <div class="sb-card">
      <div class="flex flex-col items-center text-center">
        <span class="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
          {{ auth.user?.name?.[0]?.toUpperCase() || 'S' }}
        </span>
        <h3 class="text-base font-semibold">{{ auth.user?.name || 'SeiLara' }}</h3>
        <p class="text-xs mt-1" style="color: var(--color-muted)">星轨记录者</p>
        <div class="flex items-center gap-4 mt-3 text-xs" style="color: var(--color-muted)">
          <div class="flex flex-col items-center">
            <span class="font-bold" style="color: var(--color-primary)">{{ articleList.length }}</span>
            <span>文章</span>
          </div>
          <div class="w-px h-6" style="background: var(--color-border)"></div>
          <div class="flex flex-col items-center">
            <span class="font-bold" style="color: var(--color-primary)">{{ totalViews }}</span>
            <span>阅读</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Popular -->
    <div class="sb-card">
      <div class="flex items-center gap-1.5 mb-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        <h3 class="text-xs font-semibold uppercase tracking-wider" style="color: var(--color-foreground)">热门文章</h3>
      </div>
      <ul class="space-y-3">
        <li v-for="(a, i) in popular" :key="a.id" class="flex gap-2.5">
          <span class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold border"
            :style="{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)', background: 'color-mix(in srgb, var(--color-accent) 12%, transparent)' }">
            {{ i + 1 }}
          </span>
          <NuxtLink :to="`/blog/${a.slug}`" class="text-xs leading-snug line-clamp-2 hover:text-[var(--color-accent)] transition-colors" style="color: var(--color-foreground)">
            {{ a.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Tags -->
    <div class="sb-card">
      <div class="flex items-center gap-1.5 mb-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
        <h3 class="text-xs font-semibold uppercase tracking-wider" style="color: var(--color-foreground)">标签云</h3>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <NuxtLink v-for="tag in tagList" :key="tag.slug" :to="`/blog?tag=${tag.slug}`"
          class="px-2.5 py-1 text-[.6875rem] rounded-full border transition-all"
          :style="{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }"
          hover:border-color="var(--color-accent)" hover:background="color-mix(in srgb, var(--color-accent) 10%, transparent)">
          {{ tag.name }}
        </NuxtLink>
      </div>
    </div>

    <!-- Recent -->
    <div class="sb-card">
      <div class="flex items-center gap-1.5 mb-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <h3 class="text-xs font-semibold uppercase tracking-wider" style="color: var(--color-foreground)">最新文章</h3>
      </div>
      <ul class="space-y-2.5">
        <li v-for="a in recent" :key="a.id">
          <NuxtLink :to="`/blog/${a.slug}`" class="text-xs hover:text-[var(--color-accent)] transition-colors" style="color: var(--color-foreground)">
            {{ a.title }}
          </NuxtLink>
          <p class="text-[.625rem] mt-0.5" style="color: var(--color-muted)">{{ new Date(a.createdAt).toLocaleDateString() }}</p>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.sb-card {
  padding: 1.25rem; border-radius: 14px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 50%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
