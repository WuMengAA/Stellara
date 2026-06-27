<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { render: renderMd, estimateReadingTime } = useMarkdown()

const { data } = await useFetch(`/api/articles/${slug}`)
const article = computed(() => (data.value as any)?.data)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

useHead(() => {
  const a = article.value
  if (!a) return {}
  const desc = a.seoDescription || a.excerpt || a.content?.slice(0, 160) || ''
  return {
    title: `${a.title} - Stellara`,
    meta: [
      { property: 'og:title', content: a.title },
      { property: 'og:description', content: desc },
      { property: 'og:url', content: `http://localhost:3007/blog/${a.slug}` },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:title', content: a.title },
      { name: 'twitter:description', content: desc },
    ],
  }
})

const readingTime = computed(() => article.value.readingTime || estimateReadingTime(article.value.content))
const rendered = computed(() => renderMd(article.value.content))

async function incrementView() {
  if (article.value?.id) {
    await $fetch(`/api/articles/${article.value.id}/view`, { method: 'POST' }).catch(() => {})
  }
}
onMounted(() => incrementView())

const { data: commentsData, refresh: refreshComments } = await useFetch('/api/comments', {
  query: { articleId: article.value.id },
})

const comments = computed(() => (commentsData.value as any)?.data?.comments || [])

const newComment = ref('')
const commentAuthor = ref('')
const submitting = ref(false)

async function submitComment() {
  if (!newComment.value.trim()) return
  submitting.value = true
  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: { articleId: article.value.id, content: newComment.value, authorName: commentAuthor.value || undefined },
    })
    newComment.value = ''
    refreshComments()
  } catch { /* ignore */ }
  submitting.value = false
}
</script>

<template>
  <div v-if="article" class="max-w-3xl mx-auto">
    <ReadingProgress />
    <NuxtLink to="/blog" class="b6-btn back-btn">
      <span class="b6-bg"></span>
      <span class="b6-wrap">
        <span class="b6-outline"></span>
        <span class="b6-content" style="font-size:13px">&larr; Back to Blog</span>
      </span>
    </NuxtLink>

    <article class="mt-8 space-y-8">
      <TableOfContents :content="article.content" />
      <header class="space-y-4">
        <div class="flex flex-wrap items-center gap-2 text-xs" style="color: var(--color-muted)">
          <span>{{ new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
          <span>&middot; {{ readingTime }} min read</span>
          <span v-if="article.viewCount > 0">&middot; {{ article.viewCount }} views</span>
          <span v-if="article.author?.name" class="ml-1 flex items-center gap-1">
            <span class="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] flex items-center justify-center text-white text-[9px] font-medium">
              {{ article.author.name[0]?.toUpperCase() }}
            </span>
            {{ article.author.name }}
          </span>
        </div>

        <h1 class="text-3xl md:text-4xl font-bold tracking-tight">{{ article.title }}</h1>

        <div v-if="article.tags?.length" class="flex flex-wrap gap-1.5">
          <span v-for="tag in article.tags" :key="tag.slug"
            class="px-2.5 py-0.5 rounded-full border text-xs border-[var(--color-border)]"
            style="color: var(--color-muted)">
            {{ tag.name }}
          </span>
        </div>
      </header>

      <div v-if="article.coverImage" class="rounded-xl overflow-hidden border border-[var(--color-border)]">
        <img :src="article.coverImage" :alt="article.title" class="w-full h-64 md:h-80 object-cover" />
      </div>

      <div class="markdown-content" v-html="rendered"></div>

      <div v-if="article.author" class="p-5 rounded-xl border border-[var(--color-border)] flex items-center gap-4">
        <span class="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] flex items-center justify-center text-white text-sm font-bold shrink-0">
          {{ article.author.name[0]?.toUpperCase() }}
        </span>
        <div>
          <p class="text-sm font-medium">{{ article.author.name }}</p>
          <p v-if="article.author.role === 'admin'" class="text-xs mt-0.5" style="color: var(--color-muted)">Editor</p>
        </div>
      </div>
    </article>

    <!-- Comments -->
    <section class="mt-16 space-y-6">
      <h2 class="text-sm font-semibold uppercase tracking-widest" style="color: var(--color-muted)">
        Comments <span v-if="comments.length">({{ comments.length }})</span>
      </h2>

      <div class="space-y-1.5">
        <textarea v-model="newComment" rows="3" placeholder="Leave a comment…"
          class="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none"
          :style="{ borderColor: 'var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)' }"></textarea>
        <div class="flex items-center gap-2">
          <input v-model="commentAuthor" placeholder="Name (optional)" maxlength="100"
            class="flex-1 px-3.5 py-2 rounded-xl border text-sm outline-none transition-all"
            :style="{ borderColor: 'var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)' }" />
          <button @click="submitComment" :disabled="submitting || !newComment.trim()" class="b6-btn cmt-btn">
            <span class="b6-bg"></span>
            <span class="b6-wrap">
              <span class="b6-outline"></span>
              <span class="b6-content" style="font-size:13px">{{ submitting ? 'Sending…' : 'Send' }}</span>
            </span>
          </button>
        </div>
      </div>

      <div v-if="!comments.length" class="text-center py-8">
        <p class="text-xs" style="color: var(--color-muted)">No comments yet. Be the first one!</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="comment in comments" :key="comment.id"
          class="p-4 rounded-xl border border-[var(--color-border)] space-y-2">
          <div class="flex items-center gap-2 text-xs" style="color: var(--color-muted)">
            <span v-if="comment.user" class="flex items-center gap-1">
              <span class="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] flex items-center justify-center text-white text-[9px] font-medium">
                {{ comment.user.name[0]?.toUpperCase() }}
              </span>
              {{ comment.user.name }}
            </span>
            <span v-else>{{ comment.authorName }}</span>
            <span>&middot;</span>
            <span>{{ new Date(comment.createdAt).toLocaleDateString() }}</span>
          </div>
          <p class="text-sm leading-relaxed">{{ comment.content }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.back-btn {
  height: 36px;
}
.back-btn .b6-content {
  font-size: 13px;
  padding: 0 .875rem;
}
.cmt-btn {
  height: 40px;
}
</style>
