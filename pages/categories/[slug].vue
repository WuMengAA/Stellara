<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: articlesData } = await useFetch('/api/articles', {
  params: { category: slug, perPage: 50 },
})

const { data: categoriesData } = await useFetch('/api/articles/categories')

const posts = computed(() => (articlesData.value as any)?.data?.articles || [])
const meta = computed(() => (articlesData.value as any)?.meta || {})
const categoryName = computed(() => {
  const cat = (categoriesData.value as any)?.data?.find((c: any) => c.slug === slug)
  return cat?.name || slug.charAt(0).toUpperCase() + slug.slice(1)
})
const { extractExcerpt } = useMarkdown()
</script>

<template>
  <div class="grid gap-8" style="grid-template-columns: minmax(0, 1fr) 260px;">
    <div class="space-y-6 min-w-0">
      <div class="flex items-center gap-3">
        <h1 class="text-xl font-bold tracking-tight">{{ categoryName }}</h1>
        <span class="text-xs px-2.5 py-1 rounded-full border" :style="{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }">
          {{ meta.total || posts.length }} 篇文章
        </span>
      </div>

      <div v-if="!posts.length" class="text-center py-16">
        <p class="text-sm" style="color: var(--color-muted)">该分类暂无文章</p>
      </div>

      <div v-else class="space-y-3">
        <NuxtLink v-for="post in posts" :key="post.id" :to="`/blog/${post.slug}`"
          class="group block p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all no-underline"
          :style="{ background: 'color-mix(in srgb, var(--color-surface) 50%, transparent)', backdropFilter: 'blur(8px)' }">
          <h3 class="text-base font-semibold group-hover:text-[var(--color-accent)] transition-colors truncate">
            {{ post.title }}
          </h3>
          <p class="text-xs mt-1 line-clamp-1" style="color: var(--color-muted)">
            {{ post.excerpt || extractExcerpt(post.content, 120) }}
          </p>
          <div class="flex items-center gap-3 mt-2 text-[.6875rem]" style="color: var(--color-muted)">
            <span>{{ new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
            <span v-if="post.readingTime">&middot; {{ post.readingTime }} min read</span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <aside class="hidden lg:block">
      <BlogSidebar />
    </aside>
  </div>
</template>
