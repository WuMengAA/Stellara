<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string
const error = ref('')

const title = ref('')
const type = ref<'doc' | 'folder'>('doc')
const template = ref('blank')
const parentId = ref('')
const articleId = ref('')
const articles = ref<any[]>([])
const searchQ = ref('')
const showArticlePicker = ref(false)
const loadingArticles = ref(false)

const { currentSeries, fetchSeriesBySlug } = useSeries()
onMounted(async () => {
  const series = await fetchSeriesBySlug(slug)
  if (!series) router.replace('/docs')
  fetchMyArticles()
})

async function fetchMyArticles() {
  loadingArticles.value = true
  try {
    const res = await $fetch('/api/articles', { params: { status: 'published', perPage: 50 } }) as any
    articles.value = res?.data?.articles || []
  } catch { /* ignore */ }
  loadingArticles.value = false
}

const filteredArticles = computed(() => {
  if (!searchQ.value) return articles.value.slice(0, 20)
  const q = searchQ.value.toLowerCase()
  return articles.value.filter((a: any) =>
    a.title.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q)
  ).slice(0, 20)
})

function pickArticle(a: any) {
  title.value = a.title
  articleId.value = a.id
  type.value = 'doc'
  showArticlePicker.value = false
}

function clearArticle() {
  articleId.value = ''
  title.value = ''
}

async function submit() {
  if (!title.value.trim() && !articleId.value) { error.value = '标题不能为空'; return }
  error.value = ''
  try {
    await $fetch(`/api/series/${slug}/docs`, {
      method: 'POST',
      body: {
        title: title.value || undefined,
        type: type.value,
        template: template.value,
        parentId: parentId.value || undefined,
        articleId: articleId.value || undefined,
      },
    }) as any
    router.push(`/docs/${slug}`)
  } catch (e: any) {
    error.value = e.data?.message || e.message || '创建失败'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto space-y-6 pt-8">
    <div>
      <NuxtLink :to="`/docs/${slug}`" class="text-xs" style="color: var(--color-muted)">← 返回</NuxtLink>
      <h1 class="text-lg font-bold mt-2">新建文档</h1>
      <p class="text-xs" style="color: var(--color-muted)">在 {{ currentSeries?.title }} 中创建新内容</p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="text-xs font-medium mb-1 block" style="color: var(--color-muted)">类型</label>
        <div class="flex gap-2">
          <button @click="type = 'doc'; showArticlePicker = false"
            class="flex-1 pz-card" :class="{ active: type === 'doc' && !articleId }"
            style="justify-content: center; gap: .5rem; padding: .5rem">
            <span>📄 新建文档</span>
          </button>
          <button @click="type = 'doc'; showArticlePicker = true"
            class="flex-1 pz-card" :class="{ active: !!articleId }"
            style="justify-content: center; gap: .5rem; padding: .5rem">
            <span>📝 收录文章</span>
          </button>
          <button @click="type = 'folder'; showArticlePicker = false"
            class="flex-1 pz-card" :class="{ active: type === 'folder' }"
            style="justify-content: center; gap: .5rem; padding: .5rem">
            <span>📁 文件夹</span>
          </button>
        </div>
      </div>

      <!-- Article Picker -->
      <div v-if="showArticlePicker && type === 'doc'">
        <div v-if="articleId" class="selected-article">
          <div class="flex items-center gap-2 min-w-0">
            <span>📝</span>
            <span class="text-sm truncate">{{ title }}</span>
          </div>
          <button class="text-xs" style="color: var(--color-pink)" @click="clearArticle">取消收录</button>
        </div>
        <template v-else>
          <input v-model="searchQ" placeholder="搜索已有文章..." class="doc-input mb-2" />
          <div v-if="loadingArticles" class="text-xs text-center py-4" style="color: var(--color-muted)">加载中...</div>
          <div v-else class="article-list">
            <button
              v-for="a in filteredArticles" :key="a.id"
              class="article-item"
              @click="pickArticle(a)"
            >
              <div class="min-w-0">
                <p class="text-sm font-medium truncate">{{ a.title }}</p>
                <p v-if="a.excerpt" class="text-[.625rem] truncate" style="color: var(--color-muted)">{{ a.excerpt }}</p>
              </div>
              <span class="text-xs flex-shrink-0" style="color: var(--color-muted)">{{ (a.readingTime || 1) }} min</span>
            </button>
            <p v-if="!filteredArticles.length" class="text-xs text-center py-4" style="color: var(--color-muted)">没有找到文章</p>
          </div>
        </template>
      </div>

      <!-- Title input (hidden when article picked) -->
      <div v-if="!articleId">
        <label class="text-xs font-medium mb-1 block" style="color: var(--color-muted)">标题</label>
        <input v-model="title" placeholder="输入标题" class="doc-input" />
      </div>

      <div v-if="type === 'doc' && !articleId">
        <label class="text-xs font-medium mb-1 block" style="color: var(--color-muted)">模板</label>
        <select v-model="template" class="doc-input">
          <option value="blank">空白文档</option>
          <option value="api-ref">API 参考</option>
          <option value="guide">教程指南</option>
          <option value="note">笔记随笔</option>
        </select>
      </div>

      <p v-if="error" class="text-xs" style="color: var(--color-pink)">{{ error }}</p>

      <button @click="submit" class="w-full py-2 rounded-lg text-sm font-medium"
        style="background: var(--color-accent); color: var(--color-on-accent)">
        创建
      </button>
    </div>
  </div>
</template>

<style scoped>
.doc-input {
  width: 100%; padding: .5rem .75rem; border-radius: 8px;
  border: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 30%, transparent);
  color: var(--color-foreground); font-family: inherit; font-size: .8125rem;
  outline: none; transition: border-color .2s;
}
.doc-input:focus { border-color: var(--color-accent); }
.doc-input option { background: var(--color-panel); }
.pz-card {
  display: flex; align-items: center; padding: .75rem 1rem; border-radius: 12px;
  border: 1px solid var(--color-border); cursor: pointer;
  background: color-mix(in srgb, var(--color-surface) 40%, transparent);
  text-align: left; font-family: inherit; font-size: .8125rem; color: var(--color-foreground);
}
.pz-card.active { border-color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 8%, transparent); }
.article-list {
  max-height: 240px; overflow-y: auto; display: flex; flex-direction: column; gap: 2px;
}
.article-item {
  display: flex; align-items: center; justify-content: space-between; gap: .5rem;
  width: 100%; padding: .5rem .75rem; border-radius: 8px; border: none;
  background: transparent; cursor: pointer; text-align: left;
  font-family: inherit; font-size: .8125rem; color: var(--color-foreground);
  transition: background .15s;
}
.article-item:hover { background: color-mix(in srgb, var(--color-accent) 8%, transparent); }
.selected-article {
  display: flex; align-items: center; justify-content: space-between;
  padding: .5rem .75rem; border-radius: 8px;
  border: 1px solid var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 8%, transparent);
}
</style>
