<script setup lang="ts">
const route = useRoute()
const auth = useAuthStore()
const userId = computed(() => route.params.id)

const isMe = computed(() => {
  return auth.isLoggedIn && String(auth.user?.id) === String(userId.value)
})

const { data: userData } = await useFetch(`/api/users/${userId.value}`)
const { data: userArticles } = await useFetch('/api/articles', {
  query: { authorId: userId.value, perPage: 20 },
})
const { data: userComments } = await useFetch('/api/comments', {
  query: { userId: userId.value, perPage: 20 },
})

const user = computed(() => (userData.value as any)?.data || null)
const articles = computed(() => (userArticles.value as any)?.data?.articles || [])
const comments = computed(() => (userComments.value as any)?.data?.comments || [])
const { extractExcerpt } = useMarkdown()

const activeTab = ref<'articles' | 'comments'>('articles')

const coverStyle = computed(() => {
  if (!user.value) return {}
  const colors = ['#7c4dff', '#00bcd4', '#ff4081', '#ff8c00', '#00e676', '#e040fb']
  const idx = String(user.value.id || 1).length % colors.length
  return {
    background: `linear-gradient(135deg, ${colors[idx]}, ${colors[(idx + 1) % colors.length]}, ${colors[(idx + 2) % colors.length]})`,
  }
})

const statItems = computed(() => [
  { label: '文章', value: articles.value.length },
  { label: '评论', value: comments.value.length },
  { label: '阅读', value: user.value?.articleStats?.totalViews || 0 },
])
</script>

<template>
  <div v-if="user" class="space-y-6">
    <!-- Cover + Avatar -->
    <div class="relative rounded-2xl overflow-hidden border border-[var(--color-border)]">
      <div class="h-36 md:h-48" :style="coverStyle"></div>
      <div class="px-6 pb-5">
        <div class="flex items-end gap-4 -mt-10">
          <span class="w-20 h-20 rounded-2xl border-4 border-[var(--color-background)] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg">
            {{ user.name?.[0]?.toUpperCase() || 'U' }}
          </span>
          <div class="flex-1 min-w-0 pt-11">
            <h1 class="text-xl font-bold truncate">{{ user.name }}</h1>
            <p class="text-xs mt-0.5" style="color: var(--color-muted)">
              {{ user.role === 'admin' ? '管理员' : '用户' }}
              <span v-if="user.email" class="ml-2">&middot; {{ user.email }}</span>
            </p>
          </div>
          <div v-if="isMe" class="flex gap-2 pt-11">
            <button class="b6-btn" style="height:34px" onclick="window.history.back()">
              <span class="b6-bg"></span>
              <span class="b6-wrap"><span class="b6-outline"></span><span class="b6-content" style="font-size:11px;padding:0 .75rem">Edit</span></span>
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex gap-6 mt-4">
          <div v-for="s in statItems" :key="s.label" class="flex flex-col items-center">
            <span class="text-lg font-bold" style="color: var(--color-primary)">{{ s.value }}</span>
            <span class="text-[.625rem] uppercase tracking-wider" style="color: var(--color-muted)">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 border-b border-[var(--color-border)] pb-px">
      <button @click="activeTab = 'articles'"
        class="px-4 py-2 text-sm font-medium rounded-t-lg transition-all"
        :style="{
          color: activeTab === 'articles' ? 'var(--color-accent)' : 'var(--color-muted)',
          borderBottom: activeTab === 'articles' ? '2px solid var(--color-accent)' : '2px solid transparent',
        }">
        文章 ({{ articles.length }})
      </button>
      <button @click="activeTab = 'comments'"
        class="px-4 py-2 text-sm font-medium rounded-t-lg transition-all"
        :style="{
          color: activeTab === 'comments' ? 'var(--color-accent)' : 'var(--color-muted)',
          borderBottom: activeTab === 'comments' ? '2px solid var(--color-accent)' : '2px solid transparent',
        }">
        评论 ({{ comments.length }})
      </button>
    </div>

    <!-- Articles Tab -->
    <div v-if="activeTab === 'articles'" class="space-y-3">
      <div v-if="!articles.length" class="text-center py-12">
        <p class="text-xs" style="color: var(--color-muted)">还没有文章~</p>
      </div>
      <NuxtLink v-for="a in articles" :key="a.id" :to="`/blog/${a.slug}`"
        class="block p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/20 transition-all glass-card space-y-2">
        <h3 class="font-semibold text-sm">{{ a.title }}</h3>
        <p v-if="a.excerpt" class="text-xs leading-relaxed line-clamp-2" style="color: var(--color-muted)">{{ a.excerpt }}</p>
        <div class="flex items-center gap-2 text-[.625rem]" style="color: var(--color-muted)">
          <span>{{ new Date(a.createdAt).toLocaleDateString() }}</span>
          <span v-if="a.viewCount > 0">&middot; {{ a.viewCount }} 阅读</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Comments Tab -->
    <div v-else class="space-y-3">
      <div v-if="!comments.length" class="text-center py-12">
        <p class="text-xs" style="color: var(--color-muted)">还没有评论~</p>
      </div>
      <div v-for="c in comments" :key="c.id"
        class="p-4 rounded-xl border border-[var(--color-border)] glass-card space-y-1.5">
        <div class="flex items-center gap-2 text-[.625rem]" style="color: var(--color-muted)">
          <span>{{ new Date(c.createdAt).toLocaleDateString() }}</span>
          <span v-if="c.article">&middot; 回复于 <NuxtLink :to="`/blog/${c.article.slug}`" style="color:var(--color-accent)">{{ c.article.title }}</NuxtLink></span>
        </div>
        <p class="text-sm leading-relaxed">{{ c.content }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card {
  background: color-mix(in srgb, var(--color-surface) 50%, transparent);
  backdrop-filter: blur(8px);
}
</style>
