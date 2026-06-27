<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { get, patch, delete: del } = useAuthFetch()

const searchInput = ref('')
const search = ref('')
const statusFilter = ref<string | undefined>(undefined)
const page = ref(1)
const articles = ref<any[]>([])
const meta = ref<any>(null)
const loading = ref(false)
const deleting = ref<string | null>(null)
const selected = ref<Set<string>>(new Set())
const batchProcessing = ref(false)
let debounceTimer: ReturnType<typeof setTimeout>

async function fetchArticles() {
  loading.value = true
  try {
    const params: Record<string, any> = { page: page.value, perPage: 20 }
    if (statusFilter.value) params.status = statusFilter.value
    if (search.value) params.q = search.value

    const res = await get('/api/articles', { params })
    articles.value = res.data?.articles || []
    meta.value = res.meta
    selected.value = new Set()
  } finally {
    loading.value = false
  }
}

watch(searchInput, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    search.value = searchInput.value
    page.value = 1
    fetchArticles()
  }, 300)
})

function setStatus(status?: string) {
  statusFilter.value = status
  page.value = 1
  fetchArticles()
}

function prevPage() {
  if (meta.value?.hasPrev) {
    page.value--
    fetchArticles()
  }
}

function nextPage() {
  if (meta.value?.hasNext) {
    page.value++
    fetchArticles()
  }
}

async function deleteArticle(id: string) {
  if (!confirm('确定删除这篇文章吗？')) return
  deleting.value = id
  try {
    await del(`/api/articles/${id}`)
    fetchArticles()
  } finally {
    deleting.value = null
  }
}

async function togglePin(article: any) {
  await patch(`/api/articles/${article.id}`, { pinned: !article.pinned })
  article.pinned = !article.pinned
}

function toggleSelect(id: string) {
  const s = new Set(selected.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  selected.value = s
}

function toggleSelectAll() {
  if (selected.value.size === articles.value.length) {
    selected.value = new Set()
  } else {
    selected.value = new Set(articles.value.map((a: any) => a.id))
  }
}

async function batchPublish() {
  if (!confirm(`确定批量发布 ${selected.value.size} 篇文章吗？`)) return
  batchProcessing.value = true
  try {
    await Promise.all(
      Array.from(selected.value).map(id => patch(`/api/articles/${id}`, { status: 'published' }))
    )
    fetchArticles()
  } finally {
    batchProcessing.value = false
  }
}

async function batchDelete() {
  if (!confirm(`确定批量删除 ${selected.value.size} 篇文章吗？此操作不可撤销。`)) return
  batchProcessing.value = true
  try {
    for (const id of selected.value) {
      await del(`/api/articles/${id}`)
    }
    fetchArticles()
  } finally {
    batchProcessing.value = false
  }
}

async function batchPin(pin: boolean) {
  batchProcessing.value = true
  try {
    await Promise.all(
      Array.from(selected.value).map(id => patch(`/api/articles/${id}`, { pinned: pin }))
    )
    fetchArticles()
  } finally {
    batchProcessing.value = false
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const statusTabs = [
  { label: 'All', value: undefined },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
]

fetchArticles()
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      <div class="relative flex-1 max-w-xs">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" style="color: var(--color-muted)">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          v-model="searchInput"
          placeholder="Search articles..."
          class="w-full pl-10 pr-3 py-2 rounded-xl text-sm border outline-none transition-colors focus:border-[var(--color-accent)]"
          :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }"
        />
      </div>
    </div>

    <div class="flex items-center gap-1.5 p-1 rounded-xl border w-fit" :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }">
      <button
        v-for="tab in statusTabs"
        :key="tab.label"
        @click="setStatus(tab.value)"
        class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
        :class="statusFilter === tab.value ? 'shadow-sm' : ''"
        :style="{
          background: statusFilter === tab.value ? 'var(--color-background)' : 'transparent',
          color: statusFilter === tab.value ? 'var(--color-foreground)' : 'var(--color-muted)',
        }"
      >
        {{ tab.label }}
      </button>
    </div>

    <Transition name="batch">
      <div
        v-if="selected.size > 0"
        class="flex items-center gap-3 px-4 py-2.5 rounded-xl border"
        :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }"
      >
        <span class="text-xs font-medium" style="color: var(--color-muted)">已选 {{ selected.size }} 篇</span>
        <div class="flex items-center gap-2">
          <button
            @click="batchPublish"
            :disabled="batchProcessing"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            :style="{ color: 'var(--color-accent)', background: 'var(--color-accent)' + '0a' }"
          >
            批量发布
          </button>
          <button
            @click="batchPin(true)"
            :disabled="batchProcessing"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            :style="{ color: 'var(--color-accent)', background: 'var(--color-accent)' + '0a' }"
          >
            批量置顶
          </button>
          <button
            @click="batchPin(false)"
            :disabled="batchProcessing"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            :style="{ color: 'var(--color-muted)', background: 'var(--color-surface-2)' }"
          >
            批量取消置顶
          </button>
          <button
            @click="batchDelete"
            :disabled="batchProcessing"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            :style="{ color: '#ef4444', background: '#ef4444' + '0a' }"
          >
            批量删除
          </button>
        </div>
      </div>
    </Transition>

    <div class="overflow-x-auto rounded-xl border" :style="{ borderColor: 'var(--color-border)' }">
      <table class="w-full text-sm">
        <thead>
          <tr :style="{ background: 'var(--color-surface)' }">
            <th class="text-left px-4 py-3 w-10">
              <input
                type="checkbox"
                :checked="articles.length > 0 && selected.size === articles.length"
                :indeterminate="selected.size > 0 && selected.size < articles.length"
                @change="toggleSelectAll"
                class="rounded"
                :style="{ accentColor: 'var(--color-accent)' }"
              />
            </th>
            <th class="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider" style="color: var(--color-muted)">Title</th>
            <th class="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden sm:table-cell" style="color: var(--color-muted)">Status</th>
            <th class="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden md:table-cell" style="color: var(--color-muted)">Tags</th>
            <th class="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider hidden md:table-cell" style="color: var(--color-muted)">Views</th>
            <th class="text-center px-4 py-3 font-medium text-xs uppercase tracking-wider hidden sm:table-cell" style="color: var(--color-muted)">Pinned</th>
            <th class="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider hidden sm:table-cell" style="color: var(--color-muted)">Date</th>
            <th class="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider" style="color: var(--color-muted)">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading && !articles.length">
            <td colspan="8" class="px-4 py-12 text-center text-xs" style="color: var(--color-muted)">Loading...</td>
          </tr>
          <tr v-else-if="!articles.length">
            <td colspan="8" class="px-4 py-12 text-center text-xs" style="color: var(--color-muted)">No articles found.</td>
          </tr>
          <tr
            v-for="(article, i) in articles"
            :key="article.id"
            :style="{ background: i % 2 === 0 ? 'var(--color-background)' : 'var(--color-surface)' }"
            class="transition-colors hover:brightness-95"
          >
            <td class="px-4 py-3.5 w-10">
              <input
                type="checkbox"
                :checked="selected.has(article.id)"
                @change="toggleSelect(article.id)"
                class="rounded"
                :style="{ accentColor: 'var(--color-accent)' }"
              />
            </td>
            <td class="px-4 py-3.5">
              <NuxtLink
                :to="`/admin/articles/${article.id}/edit`"
                class="font-medium transition-colors hover:opacity-80"
                style="color: var(--color-foreground)"
              >
                {{ article.title }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3.5 hidden sm:table-cell">
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                :style="{
                  background: article.status === 'published' ? 'var(--color-accent)' : 'var(--color-surface-2)',
                  color: article.status === 'published' ? '#fff' : 'var(--color-muted)',
                }"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :style="{ background: article.status === 'published' ? '#fff' : 'var(--color-muted)' }"
                />
                {{ article.status === 'published' ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-4 py-3.5 hidden md:table-cell">
              <div class="flex flex-wrap gap-1" v-if="article.tags?.length">
                <span
                  v-for="tag in article.tags"
                  :key="tag.slug"
                  class="px-2 py-0.5 rounded text-[10px] font-medium border"
                  :style="{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-muted)' }"
                >
                  {{ tag.name }}
                </span>
              </div>
              <span v-else class="text-[11px]" style="color: var(--color-muted)">—</span>
            </td>
            <td class="px-4 py-3.5 text-right text-xs hidden md:table-cell" style="color: var(--color-muted)">
              {{ article.viewCount || 0 }}
            </td>
            <td class="px-4 py-3.5 text-center hidden sm:table-cell">
              <button
                @click="togglePin(article)"
                class="text-base transition-all duration-150 hover:scale-110"
                :style="{ color: article.pinned ? 'var(--color-accent)' : 'var(--color-muted)' }"
                :title="article.pinned ? '取消置顶' : '置顶'"
              >
                📌
              </button>
            </td>
            <td class="px-4 py-3.5 text-xs whitespace-nowrap hidden sm:table-cell" style="color: var(--color-muted)">
              {{ formatDate(article.createdAt) }}
            </td>
            <td class="px-4 py-3.5 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-2">
                <NuxtLink
                  :to="`/admin/articles/${article.id}/edit`"
                  class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
                  :style="{ color: 'var(--color-accent)', background: 'var(--color-accent)' + '0a' }"
                >
                  Edit
                </NuxtLink>
                <button
                  @click="deleteArticle(article.id)"
                  :disabled="deleting === article.id"
                  class="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  :style="{ color: 'var(--color-muted)', background: 'var(--color-surface-2)' }"
                >
                  {{ deleting === article.id ? '…' : 'Delete' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="meta"
      class="flex items-center justify-between px-1 py-2 text-xs"
      style="color: var(--color-muted)"
    >
      <button
        @click="prevPage"
        :disabled="!meta.hasPrev"
        class="px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-30"
        :style="{ background: 'var(--color-surface)', color: 'var(--color-foreground)' }"
      >
        ← Prev
      </button>
      <span>Page {{ meta.page }} of {{ meta.totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="!meta.hasNext"
        class="px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-30"
        :style="{ background: 'var(--color-surface)', color: 'var(--color-foreground)' }"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<style scoped>
.batch-enter-active, .batch-leave-active {
  transition: all .2s ease;
}
.batch-enter-from, .batch-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
