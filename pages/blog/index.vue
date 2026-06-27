<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const page = ref(Number(route.query.page) || 1)
const perPage = 20
const search = ref((route.query.q as string) || '')
const activeTag = ref((route.query.tag as string) || '')

const { data: articlesData, refresh } = await useFetch('/api/articles', {
  query: { page, perPage, q: search.value || undefined, tag: activeTag.value || undefined },
  watch: [page, search, activeTag],
})

const { data: tagsData } = await useFetch('/api/tags')

const posts = computed(() => (articlesData.value as any)?.data?.articles || [])
const meta = computed(() => (articlesData.value as any)?.meta || {})
const tags = computed(() => (tagsData.value as any)?.data || [])
const { extractExcerpt } = useMarkdown()

function onSearch() {
  page.value = 1
  router.replace({ query: { ...route.query, q: search.value || undefined, page: page.value > 1 ? page.value : undefined } })
}

function filterByTag(slug: string) {
  activeTag.value = activeTag.value === slug ? '' : slug
  page.value = 1
  router.replace({ query: { tag: activeTag.value || undefined } })
}
</script>

<template>
  <div class="grid gap-8" style="grid-template-columns: minmax(0, 1fr) 260px;">
    <div class="space-y-6 min-w-0">
      <!-- Tag filters -->
      <div v-if="tags.length" class="flex flex-wrap gap-1.5">
        <button @click="activeTag = ''; onSearch()"
          class="px-3 py-1 rounded-full text-xs font-medium border transition-all"
          :style="{
            borderColor: !activeTag ? 'var(--color-accent)' : 'var(--color-border)',
            color: !activeTag ? 'var(--color-accent)' : 'var(--color-muted)',
            background: !activeTag ? 'var(--color-accent)' + '15' : 'transparent',
          }">
          All
        </button>
        <button v-for="tag in tags" :key="tag.slug" @click="filterByTag(tag.slug)"
          class="px-3 py-1 rounded-full text-xs font-medium border transition-all"
          :style="{
            borderColor: activeTag === tag.slug ? 'var(--color-accent)' : 'var(--color-border)',
            color: activeTag === tag.slug ? 'var(--color-accent)' : 'var(--color-muted)',
            background: activeTag === tag.slug ? 'var(--color-accent)' + '15' : 'transparent',
          }">
          {{ tag.name }}
        </button>
      </div>

    <div v-if="!posts.length" class="text-center py-16">
      <p class="text-sm" style="color: var(--color-muted)">No posts yet</p>
    </div>

    <div v-else class="space-y-3">
      <NuxtLink v-for="post in posts" :key="post.id" :to="`/blog/${post.slug}`"
        class="group block p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transition-all no-underline">
        <h3 class="text-base font-semibold group-hover:text-[var(--color-accent)] transition-colors truncate">
          {{ post.title }}
        </h3>
        <p class="text-xs mt-1 line-clamp-1" style="color: var(--color-muted)">
          {{ (post.excerpt || extractExcerpt(post.content, 120)) }}
        </p>
        <div class="flex items-center gap-3 mt-2 text-[.6875rem]" style="color: var(--color-muted)">
          <span>{{ new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
          <span v-if="post.readingTime">&middot; {{ post.readingTime }} min read</span>
        </div>
      </NuxtLink>
    </div>

    <div v-if="meta.totalPages > 1" class="flex items-center justify-center gap-3 pt-4">
      <button @click="page = Math.max(1, page - 1)" :disabled="page <= 1" class="b6-btn pagi-btn">
        <span class="b6-bg"></span>
        <span class="b6-wrap">
          <span class="b6-outline"></span>
          <span class="b6-content" style="font-size:13px">&larr; Prev</span>
        </span>
      </button>
      <span class="text-xs" style="color: var(--color-muted)">{{ page }} / {{ meta.totalPages }}</span>
      <button @click="page = Math.min(meta.totalPages, page + 1)" :disabled="page >= meta.totalPages" class="b6-btn pagi-btn">
        <span class="b6-bg"></span>
        <span class="b6-wrap">
          <span class="b6-outline"></span>
          <span class="b6-content" style="font-size:13px">Next &rarr;</span>
        </span>
      </button>
    </div>
    </div>

    <aside class="hidden lg:block">
      <BlogSidebar />
    </aside>
  </div>
</template>

<style scoped>
.pagi-btn {
  height: 38px;
}
.pagi-btn .b6-content {
  font-size: 13px;
  padding: 0 .875rem;
}
</style>
