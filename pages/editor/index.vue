<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const auth = useAuthStore()
const router = useRouter()

const { data: articles, refresh } = await useFetch('/api/articles', {
  params: { authorId: auth.user?.id, perPage: 50 },
}) as any

const myArticles = computed(() => (articles.value?.data || []).filter(
  (a: any) => a.author?.id === auth.user?.id
))
</script>

<template>
  <div class="max-w-lg mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold">我的文章</h1>
        <p class="text-xs mt-0.5" style="color: var(--color-muted)">管理你的创作</p>
      </div>
      <NuxtLink to="/editor/new" class="b6-btn" style="height:36px">
        <span class="b6-bg"></span>
        <span class="b6-wrap"><span class="b6-outline"></span><span class="b6-content" style="font-size:12px;padding:0 1rem">写新文章</span></span>
      </NuxtLink>
    </div>

    <div v-if="!myArticles.length" class="ed-card text-center py-12">
      <p class="text-sm" style="color: var(--color-muted)">还没有文章，开始写第一篇吧~</p>
    </div>

    <div v-else class="space-y-2">
      <NuxtLink v-for="a in myArticles" :key="a.id" :to="`/editor/${a.id}`"
        class="ed-card flex items-center justify-between gap-3" style="display:flex;text-decoration:none">
        <div class="flex-1 min-w-0 text-left">
          <p class="text-sm font-semibold truncate">{{ a.title }}</p>
          <p class="text-[.625rem] mt-0.5" style="color: var(--color-muted)">
            {{ a.status === 'published' ? '已发布' : '草稿' }}
            · {{ new Date(a.createdAt).toLocaleDateString('zh-CN') }}
          </p>
        </div>
        <span class="text-[.625rem] px-2 py-0.5 rounded-full"
          :style="{ background: a.status === 'published' ? 'rgba(16,185,129,0.15)' : 'rgba(234,179,8,0.15)', color: a.status === 'published' ? '#10b981' : '#eab308' }">
          {{ a.status === 'published' ? 'Published' : 'Draft' }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.ed-card {
  padding: 1rem; border-radius: 12px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 50%, transparent);
  backdrop-filter: blur(8px);
  transition: border-color .2s;
}
.ed-card:hover { border-color: var(--color-accent); }
</style>
